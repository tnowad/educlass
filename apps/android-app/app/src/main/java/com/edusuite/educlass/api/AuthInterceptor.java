package com.edusuite.educlass.api;

import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.apollographql.apollo3.api.http.HttpRequest;
import com.apollographql.apollo3.api.http.HttpResponse;
import com.apollographql.apollo3.network.http.HttpInterceptor;
import com.apollographql.apollo3.network.http.HttpInterceptorChain;
import com.edusuite.educlass.repository.AuthRepository;
import com.edusuite.educlass.storage.AuthStorage;

import javax.inject.Inject;
import javax.inject.Singleton;

import io.reactivex.rxjava3.core.Single;
import io.reactivex.rxjava3.schedulers.Schedulers;
import io.reactivex.rxjava3.subjects.SingleSubject;
import kotlin.coroutines.Continuation;

@Singleton
public class AuthInterceptor implements HttpInterceptor {
    private static final String TAG = "AuthInterceptor";

    private final AuthStorage authStorage;
    private final AuthRepository authRepository;
    private SingleSubject<String> refreshTokenSubject;

    @Inject
    public AuthInterceptor(AuthStorage authStorage, AuthRepository authRepository) {
        this.authStorage = authStorage;
        this.authRepository = authRepository;
    }

    @Nullable
    @Override
    public Object intercept(@NonNull HttpRequest httpRequest, @NonNull HttpInterceptorChain httpInterceptorChain, @NonNull Continuation<? super HttpResponse> continuation) {
        String accessToken = authStorage.getAccessToken();

        if (accessToken == null || accessToken.isEmpty() || isTokenExpired(accessToken)) {
            Log.d(TAG, "Access token expired or missing. Refreshing...");
            accessToken = refreshAccessToken().blockingGet();
        }

        HttpRequest authenticatedRequest = httpRequest.newBuilder()
            .addHeader("Authorization", "Bearer " + accessToken)
            .build();

        Log.d(TAG, "Sending request: " + authenticatedRequest.getUrl());
        return httpInterceptorChain.proceed(authenticatedRequest, continuation);
    }

    private boolean isTokenExpired(String token) {
        try {
            String[] parts = token.split("\\.");
            if (parts.length < 2) return true; // Invalid token

            String payload = new String(android.util.Base64.decode(parts[1], android.util.Base64.URL_SAFE));
            long exp = new org.json.JSONObject(payload).getLong("exp");
            return System.currentTimeMillis() / 1000 >= exp;
        } catch (Exception e) {
            Log.e(TAG, "Failed to parse token expiration", e);
            return true;
        }
    }

    private Single<String> refreshAccessToken() {
        synchronized (this) {
            if (refreshTokenSubject == null || refreshTokenSubject.hasThrowable()) {
                Log.d(TAG, "Starting new token refresh...");
                refreshTokenSubject = SingleSubject.create();

                authRepository.refreshToken(authStorage.getRefreshToken())
                    .subscribeOn(Schedulers.io())
                    .doOnSuccess(response -> {
                        if (response != null && response.getRefreshToken() != null) {
                            String newAccessToken = response.getRefreshToken().getAccessToken();
                            authStorage.saveTokens(newAccessToken, response.getRefreshToken().getRefreshToken());
                            Log.d(TAG, "Token refreshed successfully");
                            refreshTokenSubject.onSuccess(newAccessToken);
                        } else {
                            Log.e(TAG, "Token refresh failed");
                            refreshTokenSubject.onError(new RuntimeException("Invalid refresh response"));
                        }
                    })
                    .doOnError(error -> Log.e(TAG, "Token refresh error", error))
                    .subscribe();
            }
            return refreshTokenSubject;
        }
    }

    @Override
    public void dispose() {

    }
}
