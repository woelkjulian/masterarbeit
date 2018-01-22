package de.adorsys.finlexa.adapter;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.support.v7.widget.CardView;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Filter;
import android.widget.Filterable;
import android.widget.FrameLayout;
import android.widget.ImageButton;
import android.widget.TextView;

import java.util.ArrayList;
import java.util.List;

import de.adorsys.android.securestoragelibrary.SecurePreferences;
import de.adorsys.finlexa.R;
import de.adorsys.finlexa.activity.AccessActivity;
import de.adorsys.finlexa.model.Access;
import de.adorsys.finlexa.model.Template;
import de.adorsys.finlexa.rest.APIClient;
import de.adorsys.finlexa.rest.AccessAPIInterface;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

/**
 * Created by jwo on 01.10.17.
 */

public class AccessAdapter extends RecyclerView.Adapter<AccessAdapter.ViewHolder> implements Filterable {

    private List<Access> accesses;
    private List<Access> allAccesses;
    private Context context;

    public AccessAdapter(List<Access> accesses, Context context) {
        this.accesses = accesses;
        this.context = context;
    }

    @Override
    public AccessAdapter.ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        CardView cv = (CardView) LayoutInflater.from(parent.getContext()).inflate(R.layout.card_access, parent, false);
        return new ViewHolder(cv);
    }

    @Override
    public void onBindViewHolder(ViewHolder holder, final int position) {
        CardView cv = holder.cardView;

        TextView typeView = (TextView) cv.findViewById(R.id.card_access_type);
        TextView bankCodeView = (TextView) cv.findViewById(R.id.card_access_bankcode);
        TextView ibanView = (TextView) cv.findViewById(R.id.card_access_iban);
        FrameLayout cardBorder = (FrameLayout) cv.findViewById(R.id.access_border);

        ImageButton btnEdit = (ImageButton) cv.findViewById(R.id.card_access_btnEdit);
        ImageButton btnDelete = (ImageButton) cv.findViewById(R.id.card_access_btnDelete);

        typeView.setText(accesses.get(position).type);
        bankCodeView.setText(accesses.get(position).bankCode);
        ibanView.setText(accesses.get(position).iban);

        if(accesses.get(position).main == true) {
            cardBorder.setBackgroundColor(context.getColor(R.color.blue_light));
        } else {
            cardBorder.setBackgroundColor(context.getColor(R.color.white));
        }

        btnDelete.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                // confirm delete via dialog
                AccessAPIInterface accessAPI = APIClient.getClient().create(AccessAPIInterface.class);
                Call call = accessAPI.deleteAccess(SecurePreferences.getStringValue(context.getString(R.string.ss_user_uuid), ""), accesses.get(position).uuid);
                call.enqueue(new Callback() {
                    @Override
                    public void onResponse(Call call, Response response) {
                        accesses.remove(position);
                        notifyItemRemoved(position);
                        notifyItemRangeChanged(position, accesses.size());
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
                Intent intent = new Intent(context, AccessActivity.class);
                intent.putExtra(AccessActivity.ACCESS_ISMAIN_KEY, accesses.get(position).main);
                intent.putExtra(AccessActivity.ACCESS_BANKCODE_KEY, accesses.get(position).bankCode);
                intent.putExtra(AccessActivity.ACCESS_BANKNAME_KEY, accesses.get(position).bankName);
                intent.putExtra(AccessActivity.ACCESS_BANKLOGIN_KEY, accesses.get(position).bankLogin);
                intent.putExtra(AccessActivity.ACCESS_PIN_KEY, accesses.get(position).pin);
                intent.putExtra(AccessActivity.ACCESS_IBAN_KEY, accesses.get(position).iban);
                intent.putExtra(AccessActivity.ACCESS_TYPE_KEY, accesses.get(position).type);
                intent.putExtra(AccessActivity.ACCESS_POSITION_KEY, position);
                ((Activity) context).startActivityForResult(intent, 0);
            }
        });
    }

    @Override
    public int getItemCount() {
        return accesses.size();
    }
    public List<Access> getAccesses() {
        return this.accesses;
    }

    public void copyItems() {
        allAccesses = new ArrayList<Access>(accesses);
    }

    @Override
    public Filter getFilter() {
        return new Filter() {
            @Override
            protected FilterResults performFiltering(CharSequence charSequence) {
                List<Access> filteredResult = getFilteredResults(charSequence);
                FilterResults results = new FilterResults();
                results.values = filteredResult;
                results.count = filteredResult.size();
                return results;
            }

            @Override
            protected void publishResults(CharSequence charSequence, FilterResults filterResults) {
                accesses = (ArrayList<Access>)filterResults.values;
                notifyDataSetChanged();
            }

            private List<Access> getFilteredResults(CharSequence constraint){
                if (constraint.length() == 0){
                    accesses = new ArrayList<Access>(allAccesses);
                    return accesses;
                }
                ArrayList<Access> listResult = new ArrayList<Access>();
                for (Access acc : accesses){
                    if (acc.type.contains(constraint) || acc.type.toLowerCase().contains(constraint) ||
                            acc.iban.contains(constraint) || acc.iban.toLowerCase().contains(constraint)){
                        listResult.add(acc);
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
