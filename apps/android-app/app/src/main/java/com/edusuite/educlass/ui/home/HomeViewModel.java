package com.edusuite.educlass.ui.home;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import com.edusuite.educlass.model.Course;
import com.edusuite.educlass.repository.CourseRepository;

import java.util.List;

import javax.inject.Inject;

import dagger.hilt.android.lifecycle.HiltViewModel;
import io.reactivex.rxjava3.android.schedulers.AndroidSchedulers;
import io.reactivex.rxjava3.disposables.CompositeDisposable;
import io.reactivex.rxjava3.schedulers.Schedulers;

@HiltViewModel
public class HomeViewModel extends ViewModel {
    private final CourseRepository courseRepository;
    private final MutableLiveData<List<Course>> courses = new MutableLiveData<>();
    private final MutableLiveData<String> errorMessage = new MutableLiveData<>();
    private final CompositeDisposable disposables = new CompositeDisposable();

    @Inject
    public HomeViewModel(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
        fetchCourses();
    }

    public void fetchCourses() {
        disposables.add(courseRepository.myCourses(10, null)
            .subscribeOn(Schedulers.io())
            .observeOn(AndroidSchedulers.mainThread())
            .subscribe(
                courses::setValue,
                throwable -> errorMessage.setValue("Failed to load courses")
            )
        );
    }

    public LiveData<List<Course>> getCourses() {
        return courses;
    }

    public LiveData<String> getErrorMessage() {
        return errorMessage;
    }

    @Override
    protected void onCleared() {
        super.onCleared();
        disposables.clear();
    }
}
