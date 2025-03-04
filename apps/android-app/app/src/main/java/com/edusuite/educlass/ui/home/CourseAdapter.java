package com.edusuite.educlass.ui.home;

import android.view.LayoutInflater;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.DiffUtil;
import androidx.recyclerview.widget.ListAdapter;
import androidx.recyclerview.widget.RecyclerView;

import com.edusuite.educlass.databinding.ItemCourseBinding;
import com.edusuite.educlass.model.Course;

public class CourseAdapter extends ListAdapter<Course, CourseAdapter.CourseViewHolder> {

    private static final DiffUtil.ItemCallback<Course> DIFF_CALLBACK = new DiffUtil.ItemCallback<>() {
        @Override
        public boolean areItemsTheSame(@NonNull Course oldItem, @NonNull Course newItem) {
            return oldItem.getId().equals(newItem.getId());
        }

        @Override
        public boolean areContentsTheSame(@NonNull Course oldItem, @NonNull Course newItem) {
            return oldItem.equals(newItem);
        }
    };
    private final OnCourseClickListener onCourseClickListener;

    public CourseAdapter(OnCourseClickListener listener) {
        super(DIFF_CALLBACK);
        this.onCourseClickListener = listener;
    }

    @NonNull
    @Override
    public CourseViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        ItemCourseBinding binding = ItemCourseBinding.inflate(
            LayoutInflater.from(parent.getContext()), parent, false);
        return new CourseViewHolder(binding);
    }

    @Override
    public void onBindViewHolder(@NonNull CourseViewHolder holder, int position) {
        holder.bind(getItem(position));
    }

    public interface OnCourseClickListener {
        void onCourseClick(Course course);
    }

    class CourseViewHolder extends RecyclerView.ViewHolder {
        private final ItemCourseBinding binding;

        CourseViewHolder(ItemCourseBinding binding) {
            super(binding.getRoot());
            this.binding = binding;
        }

        void bind(Course course) {
            binding.courseTitle.setText(course.getName());
            binding.courseCode.setText(course.getName());
            binding.courseCard.setOnClickListener(v -> onCourseClickListener.onCourseClick(course));
        }
    }
}
