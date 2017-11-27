package de.adorsys.finlexa.fragment;

import android.app.Fragment;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;

import de.adorsys.android.securestoragelibrary.SecurePreferences;
import de.adorsys.finlexa.R;

/**
 * Created by jwo on 28.09.17.
 */

public class DashboardFragment extends Fragment {

    public static Fragment newInstance() {
        Fragment fragment = new DashboardFragment();
        return fragment;
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle bundle) {

        View view;

        if((view = inflater.inflate(R.layout.fragment_dashboard, container, false)) == null) {
            return null;
        }

        return view;
    }
}
