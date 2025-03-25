package com.edusuite.educlass.repository;

import android.util.Log;

import com.apollographql.apollo3.ApolloClient;
import com.apollographql.apollo3.rx3.Rx3Apollo;
import com.edusuite.educlass.MeQuery;

import javax.inject.Inject;
import javax.inject.Singleton;

import io.reactivex.rxjava3.core.Single;
import io.reactivex.rxjava3.schedulers.Schedulers;

@Singleton
public class UserRepository {
    private static final String TAG = "UserRepository";

    private final ApolloClient apolloClient;

    @Inject
    public UserRepository(ApolloClient apolloClient) {
        this.apolloClient = apolloClient;
    }

    public Single<MeQuery.Data> me() {
        Log.d(TAG, "Fetching current user data");

        return Rx3Apollo.single(apolloClient.query(new MeQuery()))
            .subscribeOn(Schedulers.io())
            .doOnSuccess(response -> {
                if (response.hasErrors() || response.data == null || response.data.getMe() == null) {
                    Log.e(TAG, "Failed to fetch user data: " + response.errors);
                } else {
                    Log.d(TAG, "Successfully fetched user data: " + response.data.getMe());
                }
            })
            .doOnError(error -> Log.e(TAG, "Error fetching user data", error))
            .map(response -> {
                if (response.hasErrors() || response.data == null || response.data.getMe() == null) {
                    throw new RuntimeException("Failed to fetch user data");
                }
                return response.data;
            });
    }
}
