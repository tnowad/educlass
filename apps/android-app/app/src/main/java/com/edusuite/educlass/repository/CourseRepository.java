package com.edusuite.educlass.repository;

import android.util.Log;

import com.apollographql.apollo3.ApolloClient;
import com.apollographql.apollo3.api.Optional;
import com.apollographql.apollo3.rx3.Rx3Apollo;
import com.edusuite.educlass.CourseQuery;
import com.edusuite.educlass.MyCoursesQuery;
import com.edusuite.educlass.model.Course;
import com.edusuite.educlass.model.PagedResult;

import java.util.stream.Collectors;

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


    public Single<PagedResult<Course>> myCourses(Integer first, String after) {
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
                var courses = response.data.getCourses().getEdges().stream()
                    .map(edge -> {
                        var node = edge.getNode();
                        return new Course(node.getId(), node.getName(), node.getCode(), node.getSection(), node.getRoom(), node.getSubject());
                    }).collect(Collectors.toList());
                var pageInfo = response.data.getCourses().getPageInfo();

                return new PagedResult<>(courses, new PagedResult.PageInfo(pageInfo.getHasNextPage(), pageInfo.getEndCursor()));
            });
    }


    public Single<Course> course(String courseId) {
        Log.d(TAG, "Fetching course with ID: " + courseId);

        return Rx3Apollo.single(apolloClient.query(new CourseQuery(courseId)))
            .subscribeOn(Schedulers.io())
            .doOnSuccess(response -> {
                if (response.hasErrors() || response.data == null || response.data.getCourse() == null) {
                    Log.e(TAG, "Failed to fetch course: " + response.errors);
                } else {
                    Log.d(TAG, "Successfully fetched course: " + response.data.getCourse().getName());
                }
            })
            .doOnError(error -> Log.e(TAG, "Error fetching course", error))
            .map(response -> {
                if (response.hasErrors() || response.data == null || response.data.getCourse() == null) {
                    throw new RuntimeException("Failed to fetch course");
                }

                var node = response.data.getCourse();
                return new Course(node.getId(), node.getName(), node.getCode(), node.getSection(), node.getRoom(), node.getSubject());
            });
    }
}
