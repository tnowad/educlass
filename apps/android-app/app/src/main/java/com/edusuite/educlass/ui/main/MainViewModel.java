package com.edusuite.educlass.ui.main;

import androidx.lifecycle.ViewModel;

import com.edusuite.educlass.storage.AuthStorage;

import javax.inject.Inject;

import dagger.hilt.android.lifecycle.HiltViewModel;

@HiltViewModel
public class MainViewModel extends ViewModel {
    private final AuthStorage authStorage;

    @Inject
    public MainViewModel(AuthStorage authStorage) {
        this.authStorage = authStorage;
    }

    public boolean isUserLoggedIn() {
        return authStorage.getAccessToken() != null;
    }
}
