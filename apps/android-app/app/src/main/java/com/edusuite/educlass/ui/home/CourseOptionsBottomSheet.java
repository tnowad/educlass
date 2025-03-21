package com.edusuite.educlass.ui.home;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.lifecycle.ViewModelProvider;

import com.edusuite.educlass.R;
import com.google.android.material.bottomsheet.BottomSheetDialogFragment;

public class CourseOptionsBottomSheet extends BottomSheetDialogFragment {

    private CourseViewModel courseViewModel;

    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_bottom_sheet_dialog, container, false);

        courseViewModel = new ViewModelProvider(requireActivity()).get(CourseViewModel.class);

        view.findViewById(R.id.btnJoinCourse).setOnClickListener(v -> {

            courseViewModel.joinCourse();
            dismiss();
        });

        view.findViewById(R.id.btnCreateCourse).setOnClickListener(v -> {

            courseViewModel.createCourse();
            dismiss();
        });

        return view;
    }
}
