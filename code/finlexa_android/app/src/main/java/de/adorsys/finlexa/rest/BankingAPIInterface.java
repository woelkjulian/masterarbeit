package de.adorsys.finlexa.rest;

import java.util.List;

import de.adorsys.finlexa.model.Access;
import de.adorsys.finlexa.model.ConfirmRequest;
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

public interface BankingAPIInterface {

    @POST("banking/sessions/{sessionId}")
    Call<String> authoriseSession(@Path("sessionId") String sessionId, @Body ConfirmRequest cr);

    @POST("banking/transactions/{transactionId}")
    Call<String> authoriseTransactionRequest(@Path("transactionId") String transactionId, @Body ConfirmRequest cr);

    @POST("banking/balances/{balanceId}")
    Call<String> authoriseBalanceRequest(@Path("balanceId") String balanceId, @Body ConfirmRequest cr);

}
