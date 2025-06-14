export interface IAdminCredentials {
  id?: string;               // Optional: The unique identifier for the admin. (Used for updating an existing admin)
  username: string;          // Required: The username of the admin.
  title: string;             // Required: The title or role of the admin (e.g., "Admin", "Manager").
  email?: string;            // Optional: The email address of the admin.
  password?: string;         // Optional: The password for the admin (used during creation or update).
  permissions?: string[];    // Optional: Array of permissions assigned to the admin (e.g., ["read", "write"]).
  departmentsIds?: number[]; // Optional: Array of department IDs that the admin belongs to (e.g., [1, 2, 3]).
}


// Interface to define the structure of admin data
export interface IAdminData {
  id: string;                // Unique identifier for the admin
  username: string;          // Admin's username
  title: string;             // Admin's title (e.g., Mr., Mrs., Dr.)
  email: string;             // Admin's email address
  isBlocked: boolean;        // Indicates whether the admin is blocked
  createdAt: string;         // Date when the admin account was created
  departments?: [];          // Optional list of departments the admin is associated with
  permissions?: [];          // Optional list of permissions granted to the admin
}