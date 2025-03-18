//package com.group.silent_santa;
//
//import com.group.silent_santa.controller.UsersController;
//import com.group.silent_santa.model.UsersModel;
//import com.group.silent_santa.service.UsersService;
//import com.group.silent_santa.repository.UsersRepository;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.mockito.MockitoAnnotations;
//
//import java.util.UUID;
//
//import static org.mockito.Mockito.*;
//import static org.junit.jupiter.api.Assertions.*;
//
//class UsersControllerTest {
//
//    @Mock
//    private UsersService usersService;
//
//    @Mock
//    private UsersRepository usersRepository;
//
//    @InjectMocks
//    private UsersController usersController;
//
//    private UsersModel mockUser;
//
//    @BeforeEach
//    public void setUp() {
//        // Initialize the mocks
//        MockitoAnnotations.openMocks(this);
//
//        // Mock a sample user
//        mockUser = new UsersModel("Test User", "test@domain.com", UsersModel.Role.ADMIN);
//    }
//
//    @Test
//    public void testGetUserById() {
//        // Arrange
//        UUID userId = mockUser.getId();
//        when(usersService.getUserById(userId)).thenReturn(mockUser);
//
//        // Act
//        UsersModel user = usersController.getUserById(userId);
//
//        // Assert
//        assertNotNull(user, "User should not be null");
//        assertEquals(mockUser.getId(), user.getId(), "User ID should match");
//        verify(usersService, times(1)).getUserById(userId); // Verifies interaction with the service
//    }
//
//    @Test
//    public void testCreateUser() {
//        // Arrange
//        when(usersService.createUser(mockUser)).thenReturn(mockUser);
//
//        // Act
//        UsersModel createdUser = usersController.createUser(mockUser);
//
//        // Assert
//        assertNotNull(createdUser, "Created user should not be null");
//        assertEquals(mockUser.getEmail(), createdUser.getEmail(), "Emails should match");
//        verify(usersService, times(1)).createUser(mockUser);
//    }
//
//    @Test
//    public void testUpdateUser() {
//        // Arrange
//        String newEmail = "updated@domain.com";
//        mockUser.setEmail(newEmail);
//        when(usersService.updateUser(mockUser)).thenReturn(mockUser);
//
//        // Act
//        UsersModel updatedUser = usersController.updateUser(mockUser);
//
//        // Assert
//        assertNotNull(updatedUser, "Updated user should not be null");
//        assertEquals(newEmail, updatedUser.getEmail(), "Email should be updated");
//        verify(usersService, times(1)).updateUser(mockUser);
//    }
//
//    @Test
//    public void testDeleteUser() {
//        // Arrange
//        UUID userId = mockUser.getId();
//        when(usersService.deleteUser(userId)).thenReturn(true);
//
//        // Act
//        boolean isDeleted = usersController.deleteUser(userId);
//
//        // Assert
//        assertTrue(isDeleted, "User should be deleted successfully");
//        verify(usersService, times(1)).deleteUser(userId);
//    }
//
//    @Test
//    public void testGetAllUsers() {
//        // Arrange
//        when(usersService.getAllUsers()).thenReturn(List.of(mockUser));
//
//        // Act
//        List<UsersModel> users = usersController.getAllUsers();
//
//        // Assert
//        assertNotNull(users, "Users list should not be null");
//        assertEquals(1, users.size(), "There should be one user");
//        assertEquals(mockUser.getEmail(), users.get(0).getEmail(), "User emails should match");
//        verify(usersService, times(1)).getAllUsers();
//    }
//}
