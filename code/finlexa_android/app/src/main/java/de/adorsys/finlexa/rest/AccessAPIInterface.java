package de.adorsys.finlexa.rest;

import java.util.List;

import de.adorsys.finlexa.model.Access;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.DELETE;
import retrofit2.http.GET;
import retrofit2.http.POST;
import retrofit2.http.PUT;
import retrofit2.http.Path;

/**
 * Created by jwo on 04.10.17.
 */

public interface AccessAPIInterface {

    @GET("users/{userId}/accesses")
    Call<List<Access>> getAll(@Path("userId") String userId);

    @POST("users/{userId}/accesses")
    Call <Access> createAccess(@Path("userId") String userId, @Body Access access);

    @GET("users/{userId}/accesses/{accessId}")
    Call <Access> getAccess(@Path("userId") String userId, @Path("accessId") String accessId);

    @PUT("users/{userId}/accesses/{accessId}")
    Call <Access> updateAccess(@Path("userId") String userId, @Path("accessId") String accessId, @Body Access access);

    @DELETE("users/{userId}/accesses/{accessId}")
    Call <Access> deleteAccess(@Path("userId") String userId, @Path("accessId") String accessId);
}
