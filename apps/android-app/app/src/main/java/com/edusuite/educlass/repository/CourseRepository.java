package com.edusuite.educlass.repository;

import android.util.Log;

import com.apollographql.apollo3.ApolloClient;
import com.apollographql.apollo3.api.Optional;
import com.apollographql.apollo3.rx3.Rx3Apollo;
import com.edusuite.educlass.MyCoursesQuery;
import com.edusuite.educlass.model.Course;
import java.util.ArrayList;
import java.util.List;

import javax.inject.Inject;
import javax.inject.Singleton;

import io.reactivex.rxjava3.core.Single;
import io.reactivex.rxjava3.schedulers.Schedulers;

@Singleton
public class CourseRepository {

    private static final String TAG = "CourseRepository";

    private final ApolloClient apolloClient;

    @Inject
    public CourseRepository(ApolloClient apolloClient) {
        this.apolloClient = apolloClient;
    }


    public Single<List<Course>> myCourses(Integer first, String after) {
        Log.d(TAG, "Fetching courses for the current user");

        return Rx3Apollo.single(apolloClient.query(new MyCoursesQuery(Optional.present(first), Optional.present(after))))
            .subscribeOn(Schedulers.io())
            .doOnSuccess(response -> {
                if (response.hasErrors() || response.data == null || response.data.getCourses() == null) {
                    Log.e(TAG, "Failed to fetch courses: " + response.errors);
                } else {
                    Log.d(TAG, "Successfully fetched courses");
                }
            })
            .doOnError(error -> Log.e(TAG, "Error fetching courses", error))
            .map(response -> {
                if (response.hasErrors() || response.data == null || response.data.getCourses() == null) {
                    throw new RuntimeException("Failed to fetch courses");
                }

                List<Course> courses = new ArrayList<>();
                for (MyCoursesQuery.Edge edge : response.data.getCourses().getEdges()) {
                    MyCoursesQuery.Node node = edge.getNode();
                    courses.add(new Course(node.getId(), node.getName(), node.getCode()));
                }
                return courses;
            });
    }
}
