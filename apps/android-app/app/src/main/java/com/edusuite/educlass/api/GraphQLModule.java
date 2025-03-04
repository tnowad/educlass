package com.edusuite.educlass.api;

import com.apollographql.apollo3.ApolloClient;
import com.edusuite.educlass.storage.AuthStorage;

import javax.inject.Singleton;

import dagger.Module;
import dagger.Provides;
import dagger.hilt.InstallIn;
import dagger.hilt.components.SingletonComponent;

@Module
@InstallIn(SingletonComponent.class)
public class GraphQLModule {

    @Provides
    @Singleton
    public static ApolloClient provideApolloClient(AuthInterceptor authInterceptor) {
        return new ApolloClient.Builder()
            .serverUrl("http://127.0.0.1:3000/graphql")
            .addHttpInterceptor(authInterceptor)
            .build();
    }


    @Provides
    @Singleton
    public static AuthInterceptor provideAuthInterceptor(AuthStorage authStorage) {
        return new AuthInterceptor(authStorage);
    }

}
