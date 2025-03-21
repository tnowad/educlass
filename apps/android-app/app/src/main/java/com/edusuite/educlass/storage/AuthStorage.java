package com.edusuite.educlass.storage;

import android.content.SharedPreferences;

import javax.inject.Inject;
import javax.inject.Singleton;

@Singleton
public class AuthStorage {
    private static final String KEY_ACCESS_TOKEN = "access_token";
    private static final String KEY_REFRESH_TOKEN = "refresh_token";
    private final SharedPreferences prefs;

    @Inject
    public AuthStorage(SharedPreferences prefs) {
        this.prefs = prefs;
    }

    public void saveTokens(String accessToken, String refreshToken) {
        prefs.edit().putString(KEY_ACCESS_TOKEN, accessToken)
            .putString(KEY_REFRESH_TOKEN, refreshToken)
            .apply();
    }

    public String getAccessToken() {
        return prefs.getString(KEY_ACCESS_TOKEN, null);
    }

    public String getRefreshToken() {
        return prefs.getString(KEY_REFRESH_TOKEN, null);
    }

    public void clearTokens() {
        prefs.edit().clear().apply();
    }
}
