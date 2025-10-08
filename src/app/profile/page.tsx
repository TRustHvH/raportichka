'use client';

import React, { useState, useEffect, useCallback } from "react";
import { Box } from "@/components/Box/Box"
import { Layout } from "@/components/Layout/Layout"
import { TextInput } from "@/components/Input/Input"
import { Button } from "@/components/Button/Button"
import { Select } from "@/components/Select/Select"
import { Option } from "@/components/Select/Option"
import styles from './profile.module.css'
import { UserRole } from "@/types/user"

interface Group {
    id: number;
    name: string;
    class_owner: string;
}

interface Student {
    id: number;
    full_name: string;
    group_id: number;
}

interface StudentWithReason extends Student {
    reason?: string;
}

// Компонент для интерфейса студента
const StudentInterface = ({ 
    groups, 
    selectedGroup, 
    students,
    selectedStudent,
    isLoading,
    onGroupChange,
    onStudentChange,
    onSubmit,
    setSelectedStudent
}: {
    groups: Group[];
    selectedGroup: Group | null;
    students: StudentWithReason[];
    selectedStudent: StudentWithReason | null;
    isLoading: boolean;
    onGroupChange: (groupId: string) => void;
    onStudentChange: (studentId: string) => void;
    onSubmit: (reason: string) => void;
    setSelectedStudent: (student: StudentWithReason | null) => void;
}) => {
    const [teachers, setTeachers] = useState<{ id: number; full_name: string }[]>([]);
    const [selectedTeacher, setSelectedTeacher] = useState<number | null>(null);
    const [isSending, setIsSending] = useState(false);
    const [reason, setReason] = useState('');
    const [userGroup, setUserGroup] = useState<Group | null>(null);
    const [isLoadingGroup, setIsLoadingGroup] = useState(true);

    useEffect(() => {
        const fetchUserGroup = async () => {
            try {
                const response = await fetch('/api/user/group');
                const data = await response.json();
                
                if (data.group) {
                    setUserGroup(data.group);
                    // Находим группу в списке групп и выбираем её
                    const foundGroup = groups.find(g => g.id === data.group.id);
                    if (foundGroup) {
                        onGroupChange(foundGroup.id.toString());
                    }
                }
            } catch (error) {
                console.error('Ошибка загрузки группы пользователя:', error);
            } finally {
                setIsLoadingGroup(false);
            }
        };

        // Запускаем загрузку группы пользователя
        fetchUserGroup();
    }, [groups, onGroupChange]);

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const response = await fetch('/api/teachers');
                const data = await response.json();
                setTeachers(data.teachers);
            } catch (error) {
                console.error('Ошибка загрузки учителей:', error);
            }
        };

        fetchTeachers();
    }, []);

    const handleStudentChange = (studentId: string) => {
        const student = students.find(s => s.id.toString() === studentId);
        if (student) {
            setSelectedStudent(student);
            onStudentChange(studentId);
            setReason(student.reason || '');
        }
    };

    const handleReasonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;
        // Если поле пустое, очищаем значение
        if (!input) {
            setReason('');
            return;
        }
        // Берем только последний введенный символ
        const lastChar = input.slice(-1);
        // Фильтруем только нужные буквы и преобразуем в заглавные
        if (['н', 'о', 'п', 'б', 'Н', 'О', 'П', 'Б'].includes(lastChar)) {
            setReason(lastChar.toUpperCase());
        } else {
            // Если введен недопустимый символ, оставляем предыдущее значение
            setReason(reason);
        }
    };

    const handleSubmit = () => {
        onSubmit(reason);
        setReason('');
    };

    const handleSendToTeacher = async () => {
        if (!selectedGroup?.id || !selectedTeacher) {
            console.error('Не выбрана группа или учитель');
            return;
        }
    
        setIsSending(true);
        try {
            const today = new Date().toISOString().split('T')[0];
            const response = await fetch('/api/attendance-lists', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    group_id: selectedGroup.id,
                    date: today,
                    teacher_id: selectedTeacher,
                    status: 'sent_to_teacher'
                }),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Ошибка при отправке списка');
            }
    
            alert('Список успешно отправлен учителю');
            setSelectedTeacher(null);
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Ошибка при отправке списка');
        } finally {
            setIsSending(false);
        }
    };

    if (isLoadingGroup) {
        return <div>Загрузка группы...</div>;
    }

    return (
        <>
            <div className="info">
                <p>Группа: {selectedGroup?.name || 'Не выбрана'}</p>
                <p>Общее кол-во чел: {students.length}</p>
                <p>ФИО кл.рук: {selectedGroup?.class_owner || 'Не выбран'}</p>
            </div>
            {!userGroup && (
                <Select 
                    description="Выберите группу" 
                    className="small"
                    onChange={onGroupChange}
                >
                    {groups.map((group) => (
                        <Option key={group.id} value={group.id.toString()}>
                            {group.name}
                        </Option>
                    ))}
                </Select>
            )}
            <Select 
                description="ФИО обучающегося" 
                className="small"
                onChange={handleStudentChange}
                disabled={!selectedGroup}
            >
                {students.map((student) => (
                    <Option key={student.id} value={student.id.toString()}>
                        {student.full_name}
                    </Option>
                ))}
            </Select>
            <TextInput
                className="small"
                label="Причина пропуска/опоздания"
                value={reason}
                onChange={handleReasonChange}
                disabled={!selectedStudent}
            />
            <Button 
                onClick={handleSubmit}
                disabled={!selectedStudent || !reason.trim()}
            >
                {isLoading ? 'Сохранение...' : 'Добавить в список'}
            </Button>
            <Select 
                description="Выберите учителя для отправки списка" 
                className="small"
                onChange={(teacherId) => setSelectedTeacher(Number(teacherId))}
                disabled={!selectedGroup || isSending}
            >
                {teachers.map((teacher) => (
                    <Option key={teacher.id} value={teacher.id.toString()}>
                        {teacher.full_name}
                    </Option>
                ))}
            </Select>
            <Button 
                onClick={handleSendToTeacher}
                disabled={!selectedGroup || !selectedTeacher || isSending}
            >
                {isSending ? 'Отправка...' : 'Отправить список учителю'}
            </Button>
        </>
    );
};

// Компонент для интерфейса дежурного
const DutyInterface = ({

}: {
    groups: Group[];
    selectedGroup: Group | null;
    students: StudentWithReason[];
    onGroupChange: (groupId: string) => void;
    onSubmit: (reason: string) => void;
}) => {
    const [lists, setLists] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedList, setSelectedList] = useState<any | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalStudents, setModalStudents] = useState<StudentWithReason[]>([]);
    const [isLoadingStudents, setIsLoadingStudents] = useState(false);

    useEffect(() => {
        const fetchLists = async () => {
            setIsLoading(true);
            try {
                const today = new Date().toISOString().split('T')[0];
                const response = await fetch(`/api/attendance-lists?date=${today}`);
                const data = await response.json();
                setLists(data.lists);
            } catch (error) {
                console.error('Ошибка загрузки списков:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLists();
    }, []);

    const fetchStudents = async (groupId: number) => {
        setIsLoadingStudents(true);
        try {
            const response = await fetch(`/api/groups/${groupId}/students`);
            const data = await response.json();
            
            const today = new Date().toISOString().split('T')[0];
            const attendanceResponse = await fetch(`/api/attendance?date=${today}`);
            const attendanceData = await attendanceResponse.json();

            const studentsWithAttendance = data.students.map((student: Student) => {
                const attendance = attendanceData.attendance?.find((a: any) => a.student_id === student.id);
                return {
                    ...student,
                    reason: attendance ? attendance.reason : ''
                };
            });

            setModalStudents(studentsWithAttendance);
        } catch (error) {
            console.error('Ошибка загрузки студентов:', error);
        } finally {
            setIsLoadingStudents(false);
        }
    };

    const handleApproveList = async (listId: number) => {
        try {
            const today = new Date().toISOString().split('T')[0];
            const response = await fetch('/api/attendance-lists', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    list_id: listId,
                    group_id: selectedList.group_id,
                    date: today,
                    status: 'approved_by_duty',
                    students: modalStudents.map(student => ({
                        student_id: student.id,
                        reason: student.reason
                    }))
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Ошибка при подтверждении списка');
            }

            setLists(lists.map(list => 
                list.id === listId 
                    ? { ...list, status: 'approved_by_duty' }
                    : list
            ));
            setIsModalOpen(false);
            setSelectedList(null);
            setModalStudents([]);
            alert('Список успешно подтвержден');
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Ошибка при подтверждении списка');
        }
    };

    const openModal = async (list: any) => {
        setSelectedList(list);
        setIsModalOpen(true);
        await fetchStudents(list.group_id);
    };

    return (
        <>
            <div className="duty-controls">
                <h2>Списки на сегодня</h2>
                {isLoading ? (
                    <div>Загрузка списков...</div>
                ) : lists.length > 0 ? (
                    <div className={styles['lists-container']}>
                        {lists
                            .sort((a, b) => {
                                if (a.status === 'approved_by_teacher' && b.status !== 'approved_by_teacher') return -1;
                                if (a.status !== 'approved_by_teacher' && b.status === 'approved_by_teacher') return 1;
                                return 0;
                            })
                            .map((list) => (
                                <div key={list.id} className={styles['list-item']}>
                                    <div className={styles['list-header']}>
                                        <h3>Группа: {list.group_name}</h3>
                                        <p>Дата: {new Date(list.date).toLocaleDateString('ru-RU')}</p>
                                        <p className={list.status === 'approved_by_teacher' ? styles['status-pending'] : styles['status-approved']}>
                                            {list.status === 'approved_by_teacher' ? 'Требует подтверждения' : 'Подтвержден'}
                                        </p>
                                    </div>
                                    <Button 
                                        onClick={() => openModal(list)}
                                    >
                                        {list.status === 'approved_by_teacher' ? 'Подтвердить список' : 'Просмотреть список'}
                                    </Button>
                                </div>
                            ))}
                    </div>
                ) : (
                    <div>Нет списков на сегодня</div>
                )}
            </div>

            {isModalOpen && selectedList && (
                <div className={styles['modal-overlay']}>
                    <div className={styles['modal-content']}>
                        <div className={styles['modal-header']}>
                            <h2 className={styles['modal-title']}>
                                Список группы {selectedList.group_name}
                            </h2>
                            <button 
                                className={styles['modal-close']}
                                onClick={() => {
                                    setIsModalOpen(false);
                                    setSelectedList(null);
                                    setModalStudents([]);
                                }}
                            >
                                ×
                            </button>
                        </div>
                        <div className={styles['list-content']}>
                            {isLoadingStudents ? (
                                <div>Загрузка списка студентов...</div>
                            ) : modalStudents.length > 0 ? (
                                modalStudents.map((student) => (
                                    <div key={student.id} className={styles['student-preview']}>
                                        <span className={styles['student-name']}>{student.full_name}</span>
                                        {student.reason && (
                                            <span className={styles['student-reason']}>{student.reason}</span>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div>Нет студентов в списке</div>
                            )}
                        </div>
                        <div className={styles['modal-actions']}>
                            <Button 
                                onClick={() => {
                                    setIsModalOpen(false);
                                    setSelectedList(null);
                                    setModalStudents([]);
                                }}
                            >
                                Закрыть
                            </Button>
                            {selectedList.status === 'approved_by_teacher' && (
                                <Button 
                                    onClick={() => handleApproveList(selectedList.id)}
                                >
                                    Подтвердить
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

// Компонент для интерфейса учителя
const TeacherInterface = ({

}: {
    groups: Group[];
    selectedGroup: Group | null;
    students: StudentWithReason[];
    onGroupChange: (groupId: string) => void;
}) => {
    const [lists, setLists] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedList, setSelectedList] = useState<any | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoadingStudents, setIsLoadingStudents] = useState(false);
    const [modalStudents, setModalStudents] = useState<StudentWithReason[]>([]);

    useEffect(() => {
        const fetchLists = async () => {
            setIsLoading(true);
            try {
                const today = new Date().toISOString().split('T')[0];
                const response = await fetch(`/api/attendance-lists?date=${today}&status=sent_to_teacher`);
                const data = await response.json();
                setLists(data.lists);
            } catch (error) {
                console.error('Ошибка загрузки списков:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLists();
    }, []);

    const fetchStudents = async (groupId: number) => {
        setIsLoadingStudents(true);
        try {
            const response = await fetch(`/api/groups/${groupId}/students`);
            const data = await response.json();
            
            const today = new Date().toISOString().split('T')[0];
            const attendanceResponse = await fetch(`/api/attendance?date=${today}`);
            const attendanceData = await attendanceResponse.json();

            const studentsWithAttendance = data.students.map((student: Student) => {
                const attendance = attendanceData.attendance?.find((a: any) => a.student_id === student.id);
                return {
                    ...student,
                    reason: attendance ? attendance.reason : ''
                };
            });

            setModalStudents(studentsWithAttendance);
        } catch (error) {
            console.error('Ошибка загрузки студентов:', error);
        } finally {
            setIsLoadingStudents(false);
        }
    };

    const handleApproveList = async (listId: number) => {
        try {
            const response = await fetch('/api/attendance-lists', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    list_id: listId,
                    group_id: selectedList.group_id,
                    date: new Date().toISOString().split('T')[0],
                    status: 'approved_by_teacher'
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Ошибка при подтверждении списка');
            }

            setLists(lists.filter(list => list.id !== listId));
            setIsModalOpen(false);
            setSelectedList(null);
            alert('Список успешно подтвержден');
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Ошибка при подтверждении списка');
        }
    };

    const handleRejectList = async (listId: number) => {
        try {
            const today = new Date().toISOString().split('T')[0];
            const response = await fetch('/api/attendance-lists', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    list_id: listId,
                    group_id: selectedList.group_id,
                    date: today,
                    status: 'rejected'
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Ошибка при отклонении списка');
            }

            setLists(lists.filter(list => list.id !== listId));
            setIsModalOpen(false);
            setSelectedList(null);
            alert('Список успешно отклонен');
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Ошибка при отклонении списка');
        }
    };

    const openModal = async (list: any) => {
        setSelectedList(list);
        setIsModalOpen(true);
        await fetchStudents(list.group_id);
    };

    return (
        <>
            <div className="teacher-controls">
                <h2>Списки на подтверждение</h2>
                {isLoading ? (
                    <div>Загрузка списков...</div>
                ) : lists.length > 0 ? (
                    <div className={styles['lists-container']}>
                        {lists.map((list) => (
                            <div key={list.id} className={styles['list-item']}>
                                <div className={styles['list-header']}>
                                    <h3>Группа: {list.group_name}</h3>
                                    <p>Дата: {new Date(list.date).toLocaleDateString('ru-RU')}</p>
                                </div>
                                <Button 
                                    onClick={() => openModal(list)}
                                >
                                    Подтвердить список
                                </Button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div>Нет списков на подтверждение</div>
                )}
            </div>

            {isModalOpen && selectedList && (
                <div className={styles['modal-overlay']}>
                    <div className={styles['modal-content']}>
                        <div className={styles['modal-header']}>
                            <h2 className={styles['modal-title']}>
                                Подтверждение списка для группы {selectedList.group_name}
                            </h2>
                            <button 
                                className={styles['modal-close']}
                                onClick={() => {
                                    setIsModalOpen(false);
                                    setSelectedList(null);
                                }}
                            >
                                ×
                            </button>
                        </div>
                        <div className={styles['list-content']}>
                            {isLoadingStudents ? (
                                <div>Загрузка списка студентов...</div>
                            ) : modalStudents.length > 0 ? (
                                modalStudents.map((student) => (
                                    <div key={student.id} className={styles['student-preview']}>
                                        <span className={styles['student-name']}>{student.full_name}</span>
                                        {student.reason && (
                                            <span className={styles['student-reason']}>{student.reason}</span>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div>Нет студентов в списке</div>
                            )}
                        </div>
                        <div className={styles['modal-actions']}>
                            <Button 
                                onClick={() => handleRejectList(selectedList.id)}
                            >
                                Отклонить список
                            </Button>
                            <Button 
                                onClick={() => handleApproveList(selectedList.id)}
                            >
                                Подтвердить
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

const ProfilePage = () => {
    const [currentUser, setCurrentUser] = useState<{ id: number; username: string; role: UserRole } | null>(null);
    const [groups, setGroups] = useState<Group[]>([]);
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
    const [students, setStudents] = useState<StudentWithReason[]>([]);
    const [selectedStudent, setSelectedStudent] = useState<StudentWithReason | null>(null);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (selectedStudent) {
            const studentExists = students.some(s => s.id === selectedStudent.id);
            if (!studentExists) {
                setSelectedStudent(null);
            }
        }
    }, [students]);


    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const response = await fetch('/api/user');
                const data = await response.json();
                setCurrentUser(data.user);
            } catch (error) {
                console.error('Ошибка загрузки данных пользователя:', error);
            }
        };

        fetchCurrentUser();
    }, []);

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const response = await fetch('/api/groups');
                const data = await response.json();
                setGroups(data.groups);
                setIsInitialLoad(false);
            } catch (error) {
                console.error('Ошибка загрузки групп:', error);
            }
        };

        fetchGroups();
    }, []);


    const fetchAttendance = useCallback(async (currentStudents: StudentWithReason[]) => {
        try {
            const today = new Date().toISOString().split('T')[0];
            const response = await fetch(`/api/attendance?date=${today}`);
            const data = await response.json();

            if (response.ok && data.attendance) {
                return currentStudents.map(student => {
                    const attendance = data.attendance.find((a: any) => a.student_id === student.id);
                    return {
                        ...student,
                        reason: attendance ? attendance.reason : ''
                    };
                });
            }
            return currentStudents;
        } catch (error) {
            console.error('Ошибка загрузки данных о посещаемости:', error);
            return currentStudents;
        }
    }, []);

    const fetchStudents = async () => {
        if (!selectedGroup) return;
        setIsLoading(true);
        try {
            const response = await fetch(`/api/groups/${selectedGroup.id}/students`);
            const data = await response.json();
            
            const studentsWithAttendance = await fetchAttendance(data.students);
            
            // Сохраняем текущего выбранного студента
            const currentStudentId = selectedStudent?.id;
            
            setStudents(studentsWithAttendance);
            
            // Если был выбран студент, находим его в новом списке
            if (currentStudentId) {
                const updatedStudent = studentsWithAttendance.find(s => s.id === currentStudentId);
                if (updatedStudent) {
                    setSelectedStudent(updatedStudent);
                }
            }
        } catch (error) {
            console.error('Ошибка загрузки студентов:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, [selectedGroup, fetchAttendance]);

    const handleGroupChange = (groupId: string) => {
        const group = groups.find(g => g.id.toString() === groupId);
        setSelectedGroup(group || null);
        // Не сбрасываем selectedStudent при смене группы
        // setSelectedStudent(null);
    }

    const handleStudentChange = (studentId: string) => {
        const student = students.find(s => s.id.toString() === studentId);
        if (student) {
            setSelectedStudent(student);
        }
    };

    const handleSubmit = async (reason: string) => {
        if (!selectedStudent) return;

        setIsLoading(true);
        try {
            const today = new Date().toISOString().split('T')[0];

            const response = await fetch('/api/attendance', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    studentId: selectedStudent.id,
                    date: today,
                    reason: reason,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Ошибка при сохранении');
            }

            // Обновляем список студентов
            if (selectedGroup) {
                const response = await fetch(`/api/groups/${selectedGroup.id}/students`);
                const data = await response.json();
                const studentsWithAttendance = await fetchAttendance(data.students);

                setStudents(studentsWithAttendance);
                
                // Находим текущего выбранного студента в обновленном списке
                const updatedStudent = studentsWithAttendance.find(s => s.id === selectedStudent.id);
                if (updatedStudent) {
                    setSelectedStudent(updatedStudent);
                } else {
                    setSelectedStudent(null);
                }
            }
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Ошибка при сохранении причины опоздания');
        } finally {
            setIsLoading(false);
        }
    };

    const date = new Date();
    const getSuffix = (num: number): string => {
        const suffixes: { [key: number]: string } = {
            1: '-й', 21: '-й', 31: '-й',
            2: '-й', 22: '-й',
            3: '-й', 23: '-й',
            4: '-й', 24: '-й'
        };
        return suffixes[num] || '-го';
    };

    const day = date.getDate();
    const month = date.toLocaleString('ru-RU', { month: 'long' });
    const year = date.getFullYear();

    const handleLogout = async () => {
        try {
            const response = await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include'
            });

            if (response.ok) {
                window.location.href = '/';
            } else {
                console.error('Ошибка при выходе из системы');
            }
        } catch (error) {
            console.error('Ошибка при выходе:', error);
            window.location.href = '/';
        }
    };

    if (isInitialLoad) {
        return (
            <Layout>
                <Box>
                    <div>Загрузка...</div>
                </Box>
            </Layout>
        );
    }

    return (
        <Layout>
            {!currentUser ? "" : <button
                className={styles['logout-button']}
                onClick={handleLogout}
            >
                Выйти
            </button>}
            <Box>
                <h1>РАПОРТИЧКА. Дата {`${month} ${day}${getSuffix(day)} ${year}`}</h1>
                
                {currentUser?.role === UserRole.STUDENT ? (
                    <StudentInterface 
                        groups={groups}
                        selectedGroup={selectedGroup}
                        students={students}
                        selectedStudent={selectedStudent}
                        isLoading={isLoading}
                        onGroupChange={handleGroupChange}
                        onStudentChange={handleStudentChange}
                        onSubmit={handleSubmit}
                        setSelectedStudent={setSelectedStudent}
                    />
                ) : currentUser?.role === UserRole.DUTY ? (
                    <DutyInterface
                        groups={groups}
                        selectedGroup={selectedGroup}
                        students={students}
                        onGroupChange={handleGroupChange}
                        onSubmit={(reason) => handleSubmit(reason)}
                    />
                ) : currentUser?.role === UserRole.TEACHER ? (
                    <TeacherInterface 
                        groups={groups}
                        selectedGroup={selectedGroup}
                        students={students}
                        onGroupChange={() => {}}
                    />
                ) : (
                    <div className={styles["zapret-block"]}>
                        <div className={styles.zapret}>Доступ запрещен</div>
                        <Button className={"w-fc"} onClick={() => {window.location.href = "/"}}>Перейти на страницу входа</Button>
                    </div>



                )}
            </Box>
            {currentUser?.role === UserRole.STUDENT ?
            <Box className="w-full box-flex">
                <div className={styles['preview-list']}>
                    {isLoading ? (
                        <div>Загрузка студентов...</div>
                    ) : (
                        students.map((student) => (
                            <div key={student.id} className={styles['student-preview']}>
                                <span className={styles['student-name']}>{student.full_name}</span>
                                {student.reason && (
                                    <span className={styles['student-reason']}>{student.reason}</span>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </Box> : <div></div>}
        </Layout>
    );
};

export default ProfilePage;