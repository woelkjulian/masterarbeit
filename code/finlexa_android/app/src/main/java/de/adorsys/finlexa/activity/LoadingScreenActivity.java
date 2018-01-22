package de.adorsys.finlexa.activity;

import android.content.Intent;
import android.os.AsyncTask;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.view.Window;
import android.view.WindowManager;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.widget.ImageView;
import android.widget.TextView;

import de.adorsys.finlexa.R;

import static de.adorsys.finlexa.R.layout.activity_loadingscreen;

/**
 * Created by jwo on 28.09.17.
 */

public class LoadingScreenActivity extends AppCompatActivity {

    private static final int SPLASH_SHOW_TIME = 5000;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        this.requestWindowFeature(Window.FEATURE_NO_TITLE);
        this.getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);
        setContentView(activity_loadingscreen);

        ImageView logo = (ImageView) findViewById(R.id.loadingScreen_logo);
        TextView text = (TextView) findViewById(R.id.loadingScreen_text);
        ImageView image = (ImageView) findViewById(R.id.loadingScreen_icon);

        Animation animation = AnimationUtils.loadAnimation(getApplicationContext(), R.anim.bottom_up);
        logo.startAnimation(animation);
        text.startAnimation(animation);
        image.startAnimation(animation);

        new BackgroundSplashTask().execute();
    }

    private class BackgroundSplashTask extends AsyncTask<Void, Void, Void> {

        @Override
        protected void onPreExecute(){
            super.onPreExecute();
        }

        @Override
        protected Void doInBackground(Void... arg0) {
            try {
                Thread.sleep(SPLASH_SHOW_TIME);
            } catch (InterruptedException e) {
                e.printStackTrace();
            } return null;
        }

        @Override
        protected void onPostExecute(Void result) {
            super.onPostExecute(result);
            Intent i = new Intent(LoadingScreenActivity.this, MainActivity.class);
            startActivity(i); finish();
        }
    }
}
