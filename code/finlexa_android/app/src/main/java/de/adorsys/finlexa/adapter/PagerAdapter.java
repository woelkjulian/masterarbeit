package de.adorsys.finlexa.adapter;

import android.content.Context;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentPagerAdapter;
import android.support.v4.view.ViewPager;

import de.adorsys.finlexa.R;
import de.adorsys.finlexa.fragment.ProfileAccessFragment;
import de.adorsys.finlexa.fragment.ProfileTemplateFragment;

/**
 * Created by jwo on 01.10.17.
 */

public class PagerAdapter extends FragmentPagerAdapter {

    Context context;
    FragmentManager fragmentManager;

    public PagerAdapter(FragmentManager fm, Context context) {
        super(fm);
        this.fragmentManager = fm;
        this.context = context;
    }

    @Override
    public Fragment getItem(int position) {

        switch (position) {
            case 0:
                return new ProfileTemplateFragment();
            case 1:
                return new ProfileAccessFragment();
            default:
                return null;
        }
    }

    @Override
    public int getCount() {
        return 2;
    }

    @Override
    public CharSequence getPageTitle(int position) {
        switch(position) {
            case 0:
                return context.getResources().getText(R.string.profile_template_tab);
            case 1:
                return context.getResources().getText(R.string.profile_access_tab);
        }
        return null;
    }

    public Fragment getActiveFragment(ViewPager container, int position) {
        String name = makeFragmentName(container.getId(), position);
        return  fragmentManager.findFragmentByTag(name);
    }

    private static String makeFragmentName(int viewId, int index) {
        return "android:switcher:" + viewId + ":" + index;
    }
}
