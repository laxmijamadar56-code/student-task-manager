package com.example.studenttaskmanager.service;

import com.example.studenttaskmanager.entity.Student;
import com.example.studenttaskmanager.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StudentService {

    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    public Student saveStudent(Student student) {
        System.out.println(">>> SAVE STUDENT CALLED");
        System.out.println(">>> Name: " + student.getName());
        System.out.println(">>> Email: " + student.getEmail());

        try {
            Student saved = studentRepository.save(student);
            System.out.println(">>> STUDENT SAVED: " + saved.getId());
            return saved;
        } catch (Exception e) {
            System.out.println(">>> DATABASE ERROR:");
            e.printStackTrace();
            throw e;
        }
    }

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public Optional<Student> getStudentById(Long id) {
        return studentRepository.findById(id);
    }

    public void deleteStudent(Long id) {
        studentRepository.deleteById(id);
    }

    // Login
    public Optional<Student> login(String email, String password) {
        Optional<Student> student =
                studentRepository.findByEmail(email);

        if (student.isPresent()
                && student.get().getPassword().equals(password)) {
            return student;
        }

        return Optional.empty();
    }
}
