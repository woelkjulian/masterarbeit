package de.adorsys.finlexa.adapter;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.provider.ContactsContract;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.CardView;
import android.support.v7.widget.RecyclerView;
import android.text.Layout;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Filter;
import android.widget.Filterable;
import android.widget.ImageButton;
import android.widget.TextView;

import java.util.ArrayList;
import java.util.List;

import de.adorsys.android.securestoragelibrary.SecurePreferences;
import de.adorsys.finlexa.R;
import de.adorsys.finlexa.activity.ProfileActivity;
import de.adorsys.finlexa.activity.TemplateActivity;
import de.adorsys.finlexa.model.Access;
import de.adorsys.finlexa.model.Template;
import de.adorsys.finlexa.rest.APIClient;
import de.adorsys.finlexa.rest.TemplateAPIInterface;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

/**
 * Created by jwo on 01.10.17.
 */

public class TemplateAdapter extends RecyclerView.Adapter<TemplateAdapter.ViewHolder> implements Filterable {

    private List<Template> templates;
    private List<Template> allTemplates;
    private Context context;

    public TemplateAdapter(List<Template> templates, Context context) {
        this.templates = templates;
        this.context = context;
    }

    @Override
    public TemplateAdapter.ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        CardView cv = (CardView) LayoutInflater.from(parent.getContext())
                .inflate(R.layout.card_template, parent, false);
        return new ViewHolder(cv);
    }

    @Override
    public void onBindViewHolder(ViewHolder holder, final int position) {
        CardView cv = holder.cardView;
        TextView nameView = (TextView) cv.findViewById(R.id.card_template_name);
        TextView ibanView = (TextView) cv.findViewById(R.id.card_template_iban);
        ImageButton btnEdit = (ImageButton) cv.findViewById(R.id.card_template_btnEdit);
        ImageButton btnDelete = (ImageButton) cv.findViewById(R.id.card_template_btnDelete);

        nameView.setText(templates.get(position).name);
        ibanView.setText(templates.get(position).iban);

        btnDelete.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                // confirm delete via dialog
                TemplateAPIInterface templateAPI = APIClient.getClient().create(TemplateAPIInterface.class);
                Call call = templateAPI.deleteTemplate(SecurePreferences.getStringValue(context.getString(R.string.ss_user_uuid), ""), templates.get(position).uuid);
                call.enqueue(new Callback() {
                    @Override
                    public void onResponse(Call call, Response response) {
                        templates.remove(position);
                        notifyItemRemoved(position);
                        notifyItemRangeChanged(position, templates.size());
                    }
                    @Override
                    public void onFailure(Call call, Throwable t) {
                        call.cancel();
                    }
                });
            }
        });

        btnEdit.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(context, TemplateActivity.class);
                intent.putExtra(TemplateActivity.TEMPLATE_NAME_KEY, templates.get(position).name);
                intent.putExtra(TemplateActivity.TEMPLATE_OWNER_KEY, templates.get(position).owner);
                intent.putExtra(TemplateActivity.TEMPLATE_IBAN_KEY, templates.get(position).iban);
                intent.putExtra(TemplateActivity.TEMPLATE_BIC_KEY, templates.get(position).bic);
                intent.putExtra(TemplateActivity.TEMPLATE_BANKNAME_KEY, templates.get(position).bankName);
                intent.putExtra(TemplateActivity.TEMPLATE_POSITION_KEY, position);
                ((Activity)context).startActivityForResult(intent, 0);
            }
        });
    }

    @Override
    public int getItemCount() {
        return templates.size();
    }

    public List<Template> getTemplates() {
        return this.templates;
    }

    public void copyItems() {
        allTemplates = new ArrayList<Template>(templates);
    }

    @Override
    public Filter getFilter() {
        return new Filter() {
            @Override
            protected FilterResults performFiltering(CharSequence charSequence) {
                List<Template> filteredResult = getFilteredResults(charSequence);

                FilterResults results = new FilterResults();
                results.values = filteredResult;
                results.count = filteredResult.size();

                return results;
            }

            @Override
            protected void publishResults(CharSequence charSequence, FilterResults filterResults) {
                templates = (ArrayList<Template>) filterResults.values;
                notifyDataSetChanged();
            }


            private List<Template> getFilteredResults(CharSequence constraint){
                if (constraint.length() == 0){
                    templates = new ArrayList<Template>(allTemplates);
                    return templates;
                }
                ArrayList<Template> listResult = new ArrayList<Template>();
                for (Template temp : templates){
                    if (temp.name.contains(constraint) || temp.iban.contains(constraint)){
                        listResult.add(temp);
                    }
                }
                return listResult;
            }
        };
    }


    public static class ViewHolder extends RecyclerView.ViewHolder {
        private CardView cardView;

        public ViewHolder(CardView v) {
            super(v);
            cardView = v;
        }
    }
}
