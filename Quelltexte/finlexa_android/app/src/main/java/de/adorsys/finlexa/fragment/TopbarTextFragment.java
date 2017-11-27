package de.adorsys.finlexa.fragment;

import android.app.Fragment;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import de.adorsys.finlexa.R;

/**
 * Created by jwo on 10.08.17.
 */

public class TopbarTextFragment extends Fragment {

    public static final String TITLE = "title";
    public static final String DESCRIPTION = "description";

    public static Fragment newInstance(String title, String description) {
        Bundle args = new Bundle();
        args.putString(TITLE, title);
        args.putString(DESCRIPTION, description);

        Fragment fragment = new TopbarTextFragment();
        fragment.setArguments(args);
        return fragment;
    }

    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle bundle) {

        View view;
        TextView tvTitle;
        TextView tvDescription;

        if((view = inflater.inflate(R.layout.fragment_topbar_text, container, false)) == null ||
                (tvTitle = (TextView) view.findViewById(R.id.topbar_text_title)) == null ||
                (tvDescription = (TextView) view.findViewById(R.id.topbar_text_description)) == null) {
            return null;
        }

        Bundle args = getArguments();
        tvTitle.setText(args.getString(TITLE));
        tvDescription.setText(args.getString(DESCRIPTION));

        return view;
    }
}
