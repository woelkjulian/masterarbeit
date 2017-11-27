package de.adorsys.finlexa.activity;

import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;

import de.adorsys.finlexa.R;
import de.adorsys.finlexa.fragment.DashboardFragment;
import de.adorsys.finlexa.fragment.TopbarFragment;

/**
 * Created by jwo on 28.09.17.
 */
// Removed from app due to no content to show here for now
public class DashboardActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.fragment_main);
        initUI();
    }

    @Override
    protected void onPause() {
        super.onPause();
    }

    @Override
    protected void onResume() {
        super.onResume();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
    }

    private void initUI() {
        getFragmentManager().beginTransaction()
                .replace(R.id.frame_topbar, TopbarFragment.newInstance("Dashboard"))
                .replace(R.id.frame_content, DashboardFragment.newInstance())
                .commit();
    }
}

