package de.adorsys.finlexa.activity;

import android.Manifest;
import android.app.Fragment;
import android.app.FragmentManager;
import android.app.FragmentTransaction;
import android.app.KeyguardManager;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.hardware.fingerprint.FingerprintManager;
import android.os.Bundle;
import android.security.keystore.KeyGenParameterSpec;
import android.security.keystore.KeyPermanentlyInvalidatedException;
import android.security.keystore.KeyProperties;
import android.support.v4.app.ActivityCompat;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.widget.Toast;

import java.io.IOException;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.KeyStore;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.NoSuchProviderException;
import java.security.UnrecoverableKeyException;
import java.security.cert.CertificateException;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.SecretKey;

import de.adorsys.finlexa.R;
import de.adorsys.finlexa.fragment.AuthoriseFragment;
import de.adorsys.finlexa.handler.FingerprintHandler;

/**
 * Created by jwo on 04.08.17.
 */

public class AuthoriseActivity extends AppCompatActivity {

    private static final String TAG = "AuthoriseActivity";
    private static final String FINGERPRINT_KEY = "fingerprint";
    private Cipher cipher;
    private KeyStore keyStore;
    private KeyGenerator keyGenerator;
    private FingerprintManager.CryptoObject cryptoObject;
    private FingerprintManager fingerprintManager;
    private KeyguardManager keyguardManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.fragment_main);

        Intent intent = getIntent();

        FragmentManager fm = getFragmentManager();
        FragmentTransaction ft = fm.beginTransaction();

        Fragment fragment = AuthoriseFragment.newInstance(
                R.mipmap.ic_fingerprint_black_48dp,
                getResources().getString(R.string.authorise_headline),
                getResources().getString(R.string.authorise_text),
                intent.getStringExtra(getString(R.string.remoteMessage_key_title)),
                intent.getStringExtra(getString(R.string.remoteMessage_key_body)),
                R.drawable.adorsys_logo_white);

        ft.replace(R.id.frame_content, fragment);
        ft.commit();

        keyguardManager = (KeyguardManager) getSystemService(KEYGUARD_SERVICE);
        fingerprintManager = (FingerprintManager) getSystemService(FINGERPRINT_SERVICE);

        try {
            if(!fingerprintManager.isHardwareDetected()) {
                Toast.makeText(this, "Your device doesn´ support fingerprint authentication", Toast.LENGTH_SHORT).show();
            }
        } catch(SecurityException e) {
            Log.e(TAG,"Exception checking fingerprint hardware", e);
        }

        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.USE_FINGERPRINT) != PackageManager.PERMISSION_GRANTED) {
            Toast.makeText(this, "Please enable fingerprint permission", Toast.LENGTH_SHORT).show();
        }

        if(!fingerprintManager.hasEnrolledFingerprints()) {
            Toast.makeText(this, "No fingerprint configured. Please register at least one fingerprint in your device settings", Toast.LENGTH_LONG).show();
        }

        if(!keyguardManager.isKeyguardSecure()) {
            Toast.makeText(this, "Please enable lockscreen security in your device settings", Toast.LENGTH_SHORT).show();
        } else {
            try {
                generateKey();
            } catch (Exception e) {
                e.printStackTrace();
            }

            if(initCipher()) {
                cryptoObject = new FingerprintManager.CryptoObject(cipher);
                FingerprintHandler handler = new FingerprintHandler(this);
                handler.setRequestId(intent.getStringExtra(getString(R.string.remoteMessage_key_uuid)));
                handler.setType(intent.getStringExtra(getString(R.string.remoteMessage_key_type)));
                handler.startAuthentication(fingerprintManager, cryptoObject);
            }
        }
    }

    private void generateKey() throws Exception {
        try {
            // "AndroidKeyStore" is standard Android keystore container
            keyStore = KeyStore.getInstance("AndroidKeyStore");
            keyGenerator = KeyGenerator.getInstance(KeyProperties.KEY_ALGORITHM_AES, "AndroidKeyStore");
            keyStore.load(null);

            // specifiy operations the key can be used for
            keyGenerator.init(new KeyGenParameterSpec.Builder(FINGERPRINT_KEY,
                    KeyProperties.PURPOSE_ENCRYPT | KeyProperties.PURPOSE_DECRYPT)
                    .setBlockModes(KeyProperties.BLOCK_MODE_CBC)

            // user has to confirm identity with a fingerprint each time they want to use the key
                    .setUserAuthenticationRequired(true)
                    .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_PKCS7)
                    .build());
            keyGenerator.generateKey();
        } catch(KeyStoreException
                | NoSuchAlgorithmException
                | NoSuchProviderException
                | InvalidAlgorithmParameterException
                | CertificateException
                | IOException e) {
            throw new Exception(e);
        }
    }
    public boolean initCipher() {
        try {
            // configure cipher with properties required for fingerprint authentication//
            cipher = Cipher.getInstance( KeyProperties.KEY_ALGORITHM_AES + "/"
                            + KeyProperties.BLOCK_MODE_CBC + "/"
                            + KeyProperties.ENCRYPTION_PADDING_PKCS7);
        } catch (NoSuchAlgorithmException |
                NoSuchPaddingException e) {
            throw new RuntimeException("Failed to get Cipher", e);
        }

        try {
            keyStore.load(null);
            SecretKey key = (SecretKey) keyStore.getKey(FINGERPRINT_KEY,
                    null);
            cipher.init(Cipher.ENCRYPT_MODE, key);
            //Return true if the cipher has been initialized successfully//
            return true;
        } catch (KeyPermanentlyInvalidatedException e) {

            //Return false if cipher initialization failed//
            return false;
        } catch (KeyStoreException | CertificateException
                | UnrecoverableKeyException | IOException
                | NoSuchAlgorithmException | InvalidKeyException e) {
            throw new RuntimeException("Failed to init Cipher", e);
        }
    }
}
