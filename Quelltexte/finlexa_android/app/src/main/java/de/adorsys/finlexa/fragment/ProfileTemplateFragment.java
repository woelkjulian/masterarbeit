package de.adorsys.finlexa.fragment;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v7.widget.GridLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.view.inputmethod.InputMethodManager;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageButton;

import java.util.ArrayList;
import java.util.List;

import de.adorsys.android.securestoragelibrary.SecurePreferences;
import de.adorsys.finlexa.R;
import de.adorsys.finlexa.activity.TemplateActivity;
import de.adorsys.finlexa.adapter.TemplateAdapter;
import de.adorsys.finlexa.model.Template;
import de.adorsys.finlexa.rest.APIClient;
import de.adorsys.finlexa.rest.TemplateAPIInterface;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

import static android.app.Activity.RESULT_OK;

/**
 * Created by jwo on 01.10.17.
 */

public class ProfileTemplateFragment extends Fragment implements View.OnClickListener {

    private RecyclerView templateRecycler;
    private TemplateAdapter adapter;
    private EditText search;
    private Button btnAddTemplate;
    private ImageButton btnSearch;

    public static Fragment newInstance() {
        Fragment fragment = new ProfileTemplateFragment();
        return fragment;
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle bundle) {

        View view;

        if ((view = inflater.inflate(R.layout.fragment_profile_templates, container, false)) == null ||
                (templateRecycler = (RecyclerView) view.findViewById(R.id.profile_templates_templateList)) == null ||
                (search = (EditText) view.findViewById(R.id.profile_templates_search)) == null ||
                (btnAddTemplate = (Button) view.findViewById(R.id.profile_templates_btnAddTemplate)) == null ||
                (btnSearch = (ImageButton) view.findViewById(R.id.profile_templates_btnSearch)) == null) {
            return null;
        }

        final List<Template> templates = new ArrayList<Template>();
        adapter = new TemplateAdapter(templates, getActivity());
        templateRecycler.setAdapter(adapter);
        GridLayoutManager layoutManager = new GridLayoutManager(getActivity(), 1);
        templateRecycler.setLayoutManager(layoutManager);

        TemplateAPIInterface templateAPI = APIClient.getClient().create(TemplateAPIInterface.class);
        Call call = templateAPI.getAll(SecurePreferences.getStringValue(getString(R.string.ss_user_uuid), ""));
        call.enqueue(new Callback() {
            @Override
            public void onResponse(Call call, Response response) {
                List<Template> templateList = (List<Template>)response.body();
                if(templateList != null && templateList.size() > 0) {
                    for(Template template : templateList) {
                        templates.add(template);
                    }
                    adapter.notifyDataSetChanged();
                }
            }

            @Override
            public void onFailure(Call call, Throwable t) {
                call.cancel();
            }
        });

        btnAddTemplate.setOnClickListener(this);
        btnSearch.setOnClickListener(this);
        search.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence charSequence, int i, int i1, int i2) {

            }

            @Override
            public void onTextChanged(CharSequence charSequence, int i, int i1, int i2) {
                if (adapter != null) {
                    adapter.getFilter().filter(charSequence);
                }
            }

            @Override
            public void afterTextChanged(Editable editable) {

            }
        });
        return view;
    }

    @Override
    public void onClick(View v) {
        switch(v.getId()) {
            case R.id.profile_templates_btnAddTemplate:
                Intent intent = new Intent(getActivity(), TemplateActivity.class);
                startActivityForResult(intent, 0);
                break;
            case R.id.profile_templates_btnSearch:
                final Animation slideLeftIn = AnimationUtils.loadAnimation(getContext(), R.anim.slide_left_in);
                final Animation slideLeftOut = AnimationUtils.loadAnimation(getContext(), R.anim.slide_left_out);
                final Animation slideRightIn = AnimationUtils.loadAnimation(getContext(), R.anim.slide_right_in);
                final Animation slideRightOut = AnimationUtils.loadAnimation(getContext(), R.anim.slide_right_out);

                if(btnAddTemplate.getVisibility() == View.VISIBLE && search.getVisibility() == View.GONE) {
                    adapter.copyItems();
                    btnSearch.setImageResource(R.mipmap.ic_cancel_black_24dp);
                    btnAddTemplate.startAnimation(slideLeftOut);
                    btnAddTemplate.setVisibility(View.GONE);
                    search.startAnimation(slideLeftIn);
                    search.setVisibility(View.VISIBLE);
                    search.setHint(getString(R.string.template_search_hint));
                } else {
                    btnSearch.setImageResource(R.mipmap.ic_search_black_24dp);
                    search.setText("");
                    search.startAnimation(slideRightOut);
                    search.setVisibility(View.GONE);
                    btnAddTemplate.startAnimation(slideRightIn);
                    btnAddTemplate.setVisibility(View.VISIBLE);
                    InputMethodManager imm = (InputMethodManager)getActivity().getSystemService(Context.INPUT_METHOD_SERVICE);
                    imm.hideSoftInputFromWindow(search.getWindowToken(),
                            InputMethodManager.RESULT_UNCHANGED_SHOWN);
                }
                break;
            default:
                break;
        }
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if(resultCode == RESULT_OK) {
            String name = data.getStringExtra(TemplateActivity.TEMPLATE_NAME_KEY);
            String owner = data.getStringExtra(TemplateActivity.TEMPLATE_OWNER_KEY);
            String iban = data.getStringExtra(TemplateActivity.TEMPLATE_IBAN_KEY);
            String bic = data.getStringExtra(TemplateActivity.TEMPLATE_BIC_KEY);
            String bankName = data.getStringExtra(TemplateActivity.TEMPLATE_BANKNAME_KEY);

            if(!name.isEmpty() && !owner.isEmpty() && !iban.isEmpty() && !bic.isEmpty() && !bankName.isEmpty()) {
                createTemplate(name, owner, iban, bic, bankName);
                adapter.notifyDataSetChanged();
            }
        }
    }

    private void createTemplate(String name,String owner,String iban,String bic, String bankName) {
        TemplateAPIInterface templateAPI = APIClient.getClient().create(TemplateAPIInterface.class);
        Template template = new Template(null, name, bankName, bic, null, iban, owner);
        Call call = templateAPI.createTemplate(SecurePreferences.getStringValue(getString(R.string.ss_user_uuid), ""), template);
        call.enqueue(new Callback() {
            @Override
            public void onResponse(Call call, Response response) {
                Template newTemplate = (Template)response.body();
                adapter.getTemplates().add(newTemplate);
                adapter.notifyDataSetChanged();
            }
            @Override
            public void onFailure(Call call, Throwable t) {
                call.cancel();
            }
        });
    }


    public void updateTemplate(final int position, String name, String owner, String iban, String bic, String bankName) {
        String uuid = adapter.getTemplates().get(position).uuid;
        TemplateAPIInterface templateAPI = APIClient.getClient().create(TemplateAPIInterface.class);
        Template template = new Template(null, name, bankName, bic, null, iban, owner);
        Call call = templateAPI.updateTemplate(SecurePreferences.getStringValue(getString(R.string.ss_user_uuid), ""), uuid, template);
        call.enqueue(new Callback() {
            @Override
            public void onResponse(Call call, Response response) {
                Template updatedTemplate = (Template)response.body();
                Template editTemplate = adapter.getTemplates().get(position);
                editTemplate.bankName = updatedTemplate.bankName;
                editTemplate.name = updatedTemplate.name;
                editTemplate.owner = updatedTemplate.owner;
                editTemplate.bic = updatedTemplate.bic;
                editTemplate.iban = updatedTemplate.iban;
                editTemplate.currency = updatedTemplate.currency;
                adapter.notifyDataSetChanged();
            }
            @Override
            public void onFailure(Call call, Throwable t) {
                call.cancel();
            }
        });
    }
}
