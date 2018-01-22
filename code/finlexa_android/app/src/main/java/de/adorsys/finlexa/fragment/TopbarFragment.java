package de.adorsys.finlexa.fragment;

import android.app.Fragment;
import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.TextView;

import org.w3c.dom.Text;

import de.adorsys.android.securestoragelibrary.SecurePreferences;
import de.adorsys.finlexa.R;
import de.adorsys.finlexa.activity.ProfileActivity;
import de.adorsys.finlexa.activity.RegisterActivity;

/**
 * Created by jwo on 10.08.17.
 */

public class TopbarFragment extends Fragment implements View.OnClickListener {

    private ImageButton btnUser;
    private ImageButton btnMenu;

    public static final String TITLE = "title";

    public static Fragment newInstance(String title) {
        Bundle args = new Bundle();
        args.putString(TITLE, title);

        Fragment fragment = new TopbarFragment();
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle bundle) {

        View view;
        TextView title;

        if((view = inflater.inflate(R.layout.fragment_topbar, container, false)) == null ||
                (title = (TextView) view.findViewById(R.id.main_topbar_title)) == null ||
                (btnUser = (ImageButton) view.findViewById(R.id.main_topbar_btnUser)) == null) {
            return null;
        }

        Bundle args = getArguments();
        title.setText(args.getString(TITLE));

        btnUser.setOnClickListener(this);
        return view;
    }

    @Override
    public void onClick(View v) {
        switch(v.getId()) {
            case R.id.main_topbar_btnUser:
                Intent profileIntent = new Intent(getActivity(), ProfileActivity.class);
                startActivity(profileIntent);
                break;
        }
    }
}
