package com.edusuite.educlass.api;

import androidx.annotation.NonNull;

import com.apollographql.apollo3.ApolloClient;
import com.edusuite.educlass.repository.AuthRepository;
import com.edusuite.educlass.storage.AuthStorage;

import javax.inject.Named;
import javax.inject.Singleton;

import dagger.Module;
import dagger.Provides;
import dagger.hilt.InstallIn;
import dagger.hilt.components.SingletonComponent;

@Module
@InstallIn(SingletonComponent.class)
public class GraphQLModule {


    private static final String SERVER_URL = "http://127.0.0.1:3000/graphql";

    @Provides
    @Singleton
    public static ApolloClient provideApolloClient(AuthInterceptor authInterceptor) {
        return new ApolloClient.Builder()
            .serverUrl(SERVER_URL)
            .addHttpInterceptor(authInterceptor)
            .build();
    }

    @Provides
    @Singleton
    @Named("ApolloClientNoAuth")
    public static ApolloClient provideApolloClientNoAuth() {
        return new ApolloClient.Builder()
            .serverUrl(SERVER_URL)
            .build();
    }

    @NonNull
    @Provides
    @Singleton
    public static AuthInterceptor provideAuthInterceptor(AuthStorage authStorage, AuthRepository authRepository) {
        return new AuthInterceptor(authStorage, authRepository);
    }

}
