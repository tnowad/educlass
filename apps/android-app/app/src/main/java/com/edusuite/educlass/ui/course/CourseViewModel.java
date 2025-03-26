package com.edusuite.educlass.ui.course;

import android.util.Log;

import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import com.edusuite.educlass.model.Course;
import com.edusuite.educlass.model.Post;
import com.edusuite.educlass.repository.CourseRepository;

import java.util.List;

import javax.inject.Inject;

import dagger.hilt.android.lifecycle.HiltViewModel;
import io.reactivex.rxjava3.disposables.CompositeDisposable;
import io.reactivex.rxjava3.schedulers.Schedulers;

@HiltViewModel
public class CourseViewModel extends ViewModel {
    private static final String TAG = "CourseViewModel";
    private final CourseRepository courseRepository;

    private final MutableLiveData<Course> course = new MutableLiveData<>();
    private final MutableLiveData<List<Post>> posts = new MutableLiveData<>();
    private final MutableLiveData<String> errorMessage = new MutableLiveData<>();
    private final CompositeDisposable disposables = new CompositeDisposable();

    @Inject
    public CourseViewModel(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    public void fetchCourse(String courseId) {
        disposables.add(courseRepository.course(courseId)
            .subscribeOn(Schedulers.io())
            .subscribe(course::postValue, error -> Log.e(TAG, "Error fetching course", error)));
    }

    public List<Post> getPosts() {
        return posts.getValue();
    }

    public MutableLiveData<String> getErrorMessage() {
        return errorMessage;
    }
}
