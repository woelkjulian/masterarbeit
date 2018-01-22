package de.adorsys.finlexa.model;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import java.util.List;

/**
 * Created by jwo on 04.10.17.
 */

public class User {

    @SerializedName("uuid")
    public String uuid;

    @SerializedName("email")
    public String email;

    @SerializedName("secret")
    public String secret;

    @SerializedName("firstName")
    public String firstName;

    @SerializedName("lastName")
    public String lastName;

    @SerializedName("token")
    public String token;

    @SerializedName("templates")
    @Expose
    public List<Template> templates = null;

    @SerializedName("accesses")
    @Expose
    public List<Access> accesses = null;




    public User(String uuid, String email, String secret, String firstName, String lastName, String token) {
        this.uuid = uuid;
        this.email = email;
        this.secret = secret;
        this.firstName = firstName;
        this.lastName = lastName;
        this.token = token;
    }
}




