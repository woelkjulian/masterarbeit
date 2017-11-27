package de.adorsys.finlexa.fragment;

import android.app.Fragment;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;

import de.adorsys.finlexa.R;

/**
 * Created by jwo on 04.08.17.
 */

public class AuthoriseFragment extends Fragment implements View.OnClickListener {

    public static final String IMAGE = "image";
    public static final String HEADLINE = "headline";
    public static final String TEXT = "text";
    public static final String ACTION_TITLE = "action_title";
    public static final String ACTION_DESC = "action_desc";
    public static final String ACTION_IMAGE = "action_image";

    public static Fragment newInstance(int image, String headline, String text, String actionTitle, String actionDesc, Integer actionImage) {

        Bundle args = new Bundle();
        args.putInt(IMAGE, image);
        args.putString(HEADLINE, headline);
        args.putString(TEXT, text);
        args.putString(ACTION_TITLE, actionTitle);
        args.putString(ACTION_DESC, actionDesc);
        args.putInt(ACTION_IMAGE, actionImage);


        Fragment fragment = new AuthoriseFragment();
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle bundle) {

        View view;
        TextView tvHeadline;
        TextView tvText;
        ImageView ivImg;
        TextView tvActionTitle;
        TextView tvActionDescription;
        ImageView ivImgAction;
        Button btnDismiss;

        if ((view = inflater.inflate(R.layout.fragment_authorise, container, false)) == null ||
                (tvHeadline = (TextView) view.findViewById(R.id.authorise_headline)) == null ||
                (tvText = (TextView) view.findViewById(R.id.authorise_text)) == null ||
                (ivImg = (ImageView) view.findViewById(R.id.authorise_image)) == null ||
                (tvActionTitle = (TextView) view.findViewById(R.id.authorise_action_title)) == null ||
                (tvActionDescription = (TextView) view.findViewById(R.id.authorise_action_description)) == null ||
                (ivImgAction = (ImageView) view.findViewById(R.id.authorise_action_image)) == null ||
                (btnDismiss = (Button) view.findViewById(R.id.authorise_btnDismiss)) == null) {
            return null;
        }

        Bundle args = getArguments();
        tvHeadline.setText(args.getString(HEADLINE));
        tvText.setText(args.getString(TEXT));
        ivImg.setImageResource(args.getInt(IMAGE));
        tvActionTitle.setText(args.getString(ACTION_TITLE));
        tvActionDescription.setText(args.getString(ACTION_DESC));
        ivImgAction.setImageResource(args.getInt(ACTION_IMAGE));

        btnDismiss.setOnClickListener(this);

        return view;
    }

    @Override
    public void onClick(View view) {
        switch(view.getId()) {
            case R.id.authorise_btnDismiss:
                getActivity().finish();
                break;
        }
    }
}
