package com.edusuite.educlass.repository;

import com.apollographql.apollo3.ApolloClient;
import com.apollographql.apollo3.rx3.Rx3Apollo;
import com.edusuite.educlass.SignInMutation;
import com.edusuite.educlass.type.SignInInput;

import javax.inject.Inject;
import javax.inject.Singleton;

import io.reactivex.rxjava3.core.Single;

@Singleton
public class AuthRepository {
    private final ApolloClient apolloClient;

    @Inject
    public AuthRepository(ApolloClient apolloClient) {
        this.apolloClient = apolloClient;
    }

    public Single<SignInMutation.Data> signIn(String email, String password) {
        SignInInput signInInput = new SignInInput(email, password);

        return Rx3Apollo.single(apolloClient.mutation(new SignInMutation(signInInput)))
            .map(response -> response.data)
            .onErrorResumeNext(Single::error);
    }
}
