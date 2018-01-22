package de.adorsys.finlexa.rest;

import java.util.List;

import de.adorsys.finlexa.model.Template;
import de.adorsys.finlexa.model.User;
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

public interface TemplateAPIInterface {

    @GET("users/{userId}/templates")
    Call <List<Template>> getAll(@Path("userId") String userId);

    @POST("users/{userId}/templates")
    Call <Template> createTemplate(@Path("userId") String userId, @Body Template template);

    @GET("users/{userId}/templates/{templateId}")
    Call <Template> getTemplate(@Path("userId") String userId, @Path("templateId") String templateId);

    @PUT("users/{userId}/templates/{templateId}")
    Call <Template> updateTemplate(@Path("userId") String userId, @Path("templateId") String templateId, @Body Template template);

    @DELETE("users/{userId}/templates/{templateId}")
    Call <Template> deleteTemplate(@Path("userId") String userId, @Path("templateId") String templateId);
}
