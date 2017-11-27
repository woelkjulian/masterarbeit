package de.adorsys.finlexa.model;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import java.util.List;

/**
 * Created by jwo on 01.10.17.
 */

public class Access {
    @SerializedName("uuid")
    @Expose
    public String uuid;

    @SerializedName("main")
    @Expose
    public Boolean main;

    @SerializedName("bankCode")
    @Expose
    public String bankCode;

    @SerializedName("bankLogin")
    @Expose
    public String bankLogin;

    @SerializedName("bankName")
    @Expose
    public String bankName;

    @SerializedName("pin")
    @Expose
    public String pin;

    @SerializedName("iban")
    @Expose
    public String iban;

    @SerializedName("type")
    @Expose
    public String type;

    public Access(String uuid, Boolean main, String bankCode, String bankName, String bankLogin, String pin, String iban, String type) {
        this.uuid = uuid;
        this.main = main;
        this.bankCode = bankCode;
        this.bankName = bankName;
        this.bankLogin = bankLogin;
        this.pin = pin;
        this.iban = iban;
        this.type = type;
    }
}