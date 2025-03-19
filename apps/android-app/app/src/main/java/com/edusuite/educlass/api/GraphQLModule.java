package com.edusuite.educlass.api;

import com.apollographql.apollo3.ApolloClient;
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
    public static ApolloClient provideApolloClient() {
        return new ApolloClient.Builder()
            .serverUrl("http://127.0.0.1:3000/graphql")
            .build();
    }
}
