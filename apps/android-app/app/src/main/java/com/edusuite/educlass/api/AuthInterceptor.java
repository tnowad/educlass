package com.edusuite.educlass.api;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.apollographql.apollo3.api.http.HttpRequest;
import com.apollographql.apollo3.api.http.HttpResponse;
import com.apollographql.apollo3.network.http.HttpInterceptor;
import com.apollographql.apollo3.network.http.HttpInterceptorChain;
import com.edusuite.educlass.storage.AuthStorage;

import kotlin.coroutines.Continuation;

class AuthInterceptor implements HttpInterceptor {
    private final AuthStorage authStorage;

    public AuthInterceptor(AuthStorage authStorage) {
        this.authStorage = authStorage;
    }

    @Nullable
    @Override
    public Object intercept(@NonNull HttpRequest httpRequest, @NonNull HttpInterceptorChain httpInterceptorChain, @NonNull Continuation<? super HttpResponse> continuation) {
        String accessToken = authStorage.getAccessToken();
        if (accessToken != null && !accessToken.isEmpty()) {
            httpRequest = httpRequest.newBuilder()
                .addHeader("Authorization", "Bearer " + accessToken)
                .build();
        }

        return httpInterceptorChain.proceed(httpRequest, continuation);
    }

    @Override
    public void dispose() {

    }

}
