package de.adorsys.finlexa.rest;

import java.util.List;

import de.adorsys.finlexa.model.User;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.DELETE;
import retrofit2.http.GET;
import retrofit2.http.POST;
import retrofit2.http.PUT;
import retrofit2.http.Path;

/**
 * Created by jwo on 02.10.17.
 */

public interface UserAPIInterface {

    @GET("users")
    Call<List<User>> getAll();

    @POST("users")
    Call<User> createUser(@Body User user);

    @GET("users/{userId}")
    Call<User> getUser(@Path("userId") String userId);

    @PUT("users/{userId}")
    Call<User> updateUser(@Path("userId") String userId, @Body User user);

    @DELETE("users/{userId}")
    Call<User> deleteUser(@Path("userId") String userId);
}
