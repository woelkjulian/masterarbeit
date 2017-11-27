package de.adorsys.finlexa.model;

import com.google.gson.annotations.SerializedName;

/**
 * Created by jwo on 16.10.17.
 */

public class ConfirmRequest {

    @SerializedName("userId")
    public String userId;

    public ConfirmRequest(String userId) {
        this.userId = userId;
    }
}
