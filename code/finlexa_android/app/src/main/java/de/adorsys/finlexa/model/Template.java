package de.adorsys.finlexa.model;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import java.util.List;

/**
 * Created by jwo on 01.10.17.
 */

public class Template {
    @SerializedName("uuid")
    @Expose
    public String uuid;
    @SerializedName("name")
    @Expose
    public String name;
    @SerializedName("bankName")
    @Expose
    public String bankName;
    @SerializedName("bic")
    @Expose
    public String bic;
    @SerializedName("currency")
    @Expose
    public String currency;
    @SerializedName("iban")
    @Expose
    public String iban;
    @SerializedName("owner")
    @Expose
    public String owner;

    public Template(String uuid, String name, String bankName, String bic, String currency, String iban, String owner) {
        this.uuid = uuid;
        this.name = name;
        this.bankName = bankName;
        this.bic = bic;
        this.currency = currency;
        this.iban = iban;
        this.owner = owner;
    }
}