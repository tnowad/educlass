package com.edusuite.educlass.repository;

import android.util.Log;

import com.apollographql.apollo3.ApolloClient;
import com.apollographql.apollo3.api.Optional;
import com.apollographql.apollo3.rx3.Rx3Apollo;
import com.edusuite.educlass.PostsQuery;
import com.edusuite.educlass.model.PagedResult;
import com.edusuite.educlass.model.Post;
import com.edusuite.educlass.type.PostWhereInput;

import java.util.ArrayList;

import javax.inject.Inject;
import javax.inject.Singleton;

import io.reactivex.rxjava3.core.Single;
import io.reactivex.rxjava3.schedulers.Schedulers;

@Singleton
public class PostRepository {

    private static final String TAG = "PostRepository";

    private final ApolloClient apolloClient;

    @Inject
    public PostRepository(ApolloClient apolloClient) {
        this.apolloClient = apolloClient;
    }


    public Single<PagedResult<Post>> posts(Integer first, String after, PostWhereInput where) {
        Log.d(TAG, "Fetching posts...");

        return Rx3Apollo.single(apolloClient.query(new PostsQuery(
                first != null ? Optional.present(first) : Optional.absent(),
                after != null ? Optional.present(after) : Optional.absent(),
                where != null ? Optional.present(where) : Optional.absent()
            )))
            .subscribeOn(Schedulers.io())
            .map(response -> {
                if (response.hasErrors() || response.data == null || response.data.getPosts() == null) {
                    Log.e(TAG, "Failed to fetch posts: " + response.errors);
                    throw new RuntimeException("Failed to fetch posts");
                }

                var posts = new ArrayList<Post>();
                for (PostsQuery.Edge edge : response.data.getPosts().getEdges()) {
                    var node = edge.getNode();
                    posts.add(new Post(node.getId(), node.getContent()));
                }

                var pageInfo = response.data.getPosts().getPageInfo();
                return new PagedResult<>(posts, new PagedResult.PageInfo(pageInfo.getHasNextPage(), pageInfo.getEndCursor()));
            });
    }
}
