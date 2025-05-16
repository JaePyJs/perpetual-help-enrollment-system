"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { useSupabaseData } from "@/lib/useSupabaseData";
import {
  StudentProfile,
  ContactInformation,
  AcademicRecord,
  Document,
} from "@/types/student";
import Loading from "@/app/components/Loading";
import ErrorMessage from "@/app/components/ErrorMessage";
import styles from "./student-profile.module.css";

// Add authentication guard for profile page
export default function StudentProfilePage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("personal-info");
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Student data
  const {
    data: profileData,
    loading: profileLoading,
    error: profileError,
  } = useSupabaseData<StudentProfile>({
    table: "student_profiles",
    match: { user_id: user?.id },
  });

  const {
    data: contactData,
    loading: contactLoading,
    error: contactError,
  } = useSupabaseData<ContactInformation>({
    table: "contact_information",
    match: { student_id: profileData?.[0]?.student_id },
  });

  const {
    data: academicRecords,
    loading: academicLoading,
    error: academicError,
  } = useSupabaseData<AcademicRecord>({
    table: "academic_records",
    match: { student_id: profileData?.[0]?.student_id },
    order: { column: "academic_year", ascending: false },
  });

  const {
    data: documents,
    loading: documentsLoading,
    error: documentsError,
  } = useSupabaseData<Document>({
    table: "documents",
    match: { student_id: profileData?.[0]?.student_id },
  });

  // Form state
  const [personalInfo, setPersonalInfo] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    birthdate: "",
    gender: "",
    civil_status: "",
    nationality: "",
    religion: "",
  });

  const [contactInfo, setContactInfo] = useState({
    personal_email: "",
    mobile_number: "",
    present_address: "",
    permanent_address: "",
    emergency_contact_name: "",
    emergency_contact_relation: "",
    emergency_contact_number: "",
  });

  // Update form state when data is loaded
  useEffect(() => {
    if (profileData && profileData[0]) {
      const profile = profileData[0];
      setPersonalInfo({
        first_name: profile.first_name || "",
        middle_name: profile.middle_name || "",
        last_name: profile.last_name || "",
        birthdate: profile.birthdate || "",
        gender: profile.gender || "",
        civil_status: profile.civil_status || "",
        nationality: profile.nationality || "",
        religion: profile.religion || "",
      });
    }
  }, [profileData]);

  useEffect(() => {
    if (contactData && contactData[0]) {
      const contact = contactData[0];
      setContactInfo({
        personal_email: contact.personal_email || "",
        mobile_number: contact.mobile_number || "",
        present_address: contact.present_address || "",
        permanent_address: contact.permanent_address || "",
        emergency_contact_name: contact.emergency_contact_name || "",
        emergency_contact_relation: contact.emergency_contact_relation || "",
        emergency_contact_number: contact.emergency_contact_number || "",
      });
    }
  }, [contactData]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [authLoading, isAuthenticated, router]);

  // Loading state
  if (authLoading || profileLoading) {
    return <Loading size="large" message="Loading profile..." />;
  }

  // Error handling
  if (profileError) {
    return <ErrorMessage message={`Error loading profile: ${profileError}`} />;
  }

  if (!profileData || profileData.length === 0) {
    return <ErrorMessage message="No profile data found for this student" />;
  }

  const profile = profileData[0];

  return (
    <div className="student-dashboard">
      <aside className="sidebar">
        <div className="menu-section">
          <h3>Main Menu</h3>
          <ul>
            <li>
              <Link href="#">📢 Site News</Link>
            </li>
          </ul>
        </div>
        <div className="menu-section">
          <h3>Navigation</h3>
          <ul>
            <li>
              <Link href="/student-dashboard">🏠 Dashboard</Link>
            </li>
            <li>
              <Link href="/student-enrollment">📝 Enrollment</Link>
            </li>
            <li>
              <Link href="#">📚 My Courses</Link>
            </li>
            <li>
              <Link href="/student-finances">💰 Finances</Link>
            </li>
            <li>
              <Link href="#">📊 Grades</Link>
            </li>
            <li>
              <Link href="/student-profile" className="active">
                👤 Profile
              </Link>
            </li>
          </ul>
        </div>
        <div className="menu-section">
          <h3>Calendar</h3>
          <div className="calendar-box">📅 May 2025</div>
        </div>
        <div className="menu-section">
          <h3>Activities</h3>
          <ul>
            <li>
              <Link href="#">💬 Forums</Link>
            </li>
          </ul>
        </div>
      </aside>

      <main className="main-content">
        <div className="header">
          <h1>Student Profile</h1>
          <div className="student-info">
            <span id="student-id">ID: {profile.student_id}</span>
            <span id="student-name">
              {profile.first_name} {profile.last_name}
            </span>
            <span id="student-dept">Department: {profile.department}</span>
          </div>
        </div>

        {saveSuccess && (
          <div className="success-message">
            Your changes have been saved successfully.
            <button onClick={() => setSaveSuccess(false)} className="close-btn">
              ×
            </button>
          </div>
        )}

        {saveError && (
          <ErrorMessage
            message={saveError}
            onDismiss={() => setSaveError(null)}
          />
        )}

        <div className={styles.profileContainer}>
          <div className={styles.profileSidebar}>
            <div className={styles.profileImageContainer}>
              <Image
                src="/images/default-profile.png"
                alt="Profile Picture"
                className={styles.profileImage}
                width={150}
                height={150}
              />
              <button className={styles.photoBtn}>Change Photo</button>
              <input
                type="file"
                id="photo-upload"
                accept="image/*"
                style={{ display: "none" }}
              />
            </div>
            <div className={styles.profileNav}>
              <ul>
                <li
                  className={
                    activeSection === "personal-info" ? styles.active : ""
                  }
                  onClick={() => setActiveSection("personal-info")}
                >
                  Personal Information
                </li>
                <li
                  className={
                    activeSection === "contact-info" ? styles.active : ""
                  }
                  onClick={() => setActiveSection("contact-info")}
                >
                  Contact Information
                </li>
                <li
                  className={
                    activeSection === "academic-info" ? styles.active : ""
                  }
                  onClick={() => setActiveSection("academic-info")}
                >
                  Academic Information
                </li>
                <li
                  className={activeSection === "documents" ? styles.active : ""}
                  onClick={() => setActiveSection("documents")}
                >
                  Documents
                </li>
                <li
                  className={
                    activeSection === "account-settings" ? styles.active : ""
                  }
                  onClick={() => setActiveSection("account-settings")}
                >
                  Account Settings
                </li>
              </ul>
            </div>
          </div>

          <div className={styles.profileContent}>
            {/* Personal Information Section */}
            <div
              className={`${styles.profileSection} ${
                activeSection === "personal-info" ? styles.active : ""
              }`}
              id="personal-info"
            >
              <h2>Personal Information</h2>
              <div className="section-content">
                <form id="personal-info-form">
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="first-name">First Name</label>
                      <input
                        type="text"
                        id="first-name"
                        value={personalInfo.first_name}
                        onChange={(e) =>
                          setPersonalInfo({
                            ...personalInfo,
                            first_name: e.target.value,
                          })
                        }
                        required
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="middle-name">Middle Name</label>
                      <input
                        type="text"
                        id="middle-name"
                        value={personalInfo.middle_name}
                        onChange={(e) =>
                          setPersonalInfo({
                            ...personalInfo,
                            middle_name: e.target.value,
                          })
                        }
                        placeholder="Enter your middle name"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="last-name">Last Name</label>
                      <input
                        type="text"
                        id="last-name"
                        value={personalInfo.last_name}
                        onChange={(e) =>
                          setPersonalInfo({
                            ...personalInfo,
                            last_name: e.target.value,
                          })
                        }
                        required
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="birthdate">Date of Birth</label>
                      <input
                        type="date"
                        id="birthdate"
                        value={personalInfo.birthdate}
                        onChange={(e) =>
                          setPersonalInfo({
                            ...personalInfo,
                            birthdate: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="gender">Gender</label>
                      <select
                        id="gender"
                        value={personalInfo.gender}
                        onChange={(e) =>
                          setPersonalInfo({
                            ...personalInfo,
                            gender: e.target.value as string,
                          })
                        }
                        required
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="prefer-not-to-say">
                          Prefer not to say
                        </option>
                      </select>
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="civil-status">Civil Status</label>
                      <select
                        id="civil-status"
                        value={personalInfo.civil_status}
                        onChange={(e) =>
                          setPersonalInfo({
                            ...personalInfo,
                            civil_status: e.target.value as string,
                          })
                        }
                        required
                      >
                        <option value="single">Single</option>
                        <option value="married">Married</option>
                        <option value="divorced">Divorced</option>
                        <option value="widowed">Widowed</option>
                      </select>
                    </div>
                  </div>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="nationality">Nationality</label>
                      <input
                        type="text"
                        id="nationality"
                        value={personalInfo.nationality}
                        onChange={(e) =>
                          setPersonalInfo({
                            ...personalInfo,
                            nationality: e.target.value,
                          })
                        }
                        required
                        placeholder="Enter your nationality"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="religion">Religion</label>
                      <input
                        type="text"
                        id="religion"
                        value={personalInfo.religion}
                        onChange={(e) =>
                          setPersonalInfo({
                            ...personalInfo,
                            religion: e.target.value,
                          })
                        }
                        placeholder="Enter your religion"
                      />
                    </div>
                  </div>
                  <div className={styles.formActions}>
                    <button type="submit" className={styles.primaryBtn}>
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Contact Information Section */}
            <div
              className={`${styles.profileSection} ${
                activeSection === "contact-info" ? styles.active : ""
              }`}
              id="contact-info"
            >
              <h2>Contact Information</h2>
              {contactLoading ? (
                <Loading size="medium" />
              ) : contactError ? (
                <ErrorMessage message={contactError} />
              ) : (
                <div className="section-content">
                  <form id="contact-info-form">
                    <div className={styles.formRow}>
                      <div
                        className={`${styles.formGroup} ${styles.fullWidth}`}
                      >
                        <label htmlFor="email">Email Address</label>
                        <input
                          type="email"
                          id="email"
                          value={`${profile.student_id}@manila.uphsl.edu.ph`}
                          disabled
                        />
                        <small>Your school email cannot be changed</small>
                      </div>
                    </div>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label htmlFor="personal-email">Personal Email</label>
                        <input
                          type="email"
                          id="personal-email"
                          value={contactInfo.personal_email}
                          onChange={(e) =>
                            setContactInfo({
                              ...contactInfo,
                              personal_email: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label htmlFor="mobile-number">Mobile Number</label>
                        <input
                          type="tel"
                          id="mobile-number"
                          value={contactInfo.mobile_number}
                          onChange={(e) =>
                            setContactInfo({
                              ...contactInfo,
                              mobile_number: e.target.value,
                            })
                          }
                          required
                          placeholder="Enter your mobile number"
                        />
                      </div>
                    </div>
                    <div className={styles.formRow}>
                      <div
                        className={`${styles.formGroup} ${styles.fullWidth}`}
                      >
                        <label htmlFor="present-address">Present Address</label>
                        <textarea
                          id="present-address"
                          rows={3}
                          value={contactInfo.present_address}
                          onChange={(e) =>
                            setContactInfo({
                              ...contactInfo,
                              present_address: e.target.value,
                            })
                          }
                          required
                          placeholder="Enter your present address"
                        />
                      </div>
                    </div>
                    <div className={styles.formRow}>
                      <div
                        className={`${styles.formGroup} ${styles.fullWidth}`}
                      >
                        <label htmlFor="permanent-address">
                          Permanent Address
                        </label>
                        <textarea
                          id="permanent-address"
                          rows={3}
                          value={contactInfo.permanent_address}
                          onChange={(e) =>
                            setContactInfo({
                              ...contactInfo,
                              permanent_address: e.target.value,
                            })
                          }
                          required
                          placeholder="Enter your permanent address"
                        />
                      </div>
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="emergency-contact-name">
                        Emergency Contact Name
                      </label>
                      <input
                        type="text"
                        id="emergency-contact-name"
                        value={contactInfo.emergency_contact_name}
                        onChange={(e) =>
                          setContactInfo({
                            ...contactInfo,
                            emergency_contact_name: e.target.value,
                          })
                        }
                        required
                        placeholder="Enter emergency contact name"
                      />
                    </div>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label htmlFor="emergency-contact-relation">
                          Relationship
                        </label>
                        <input
                          type="text"
                          id="emergency-contact-relation"
                          value={contactInfo.emergency_contact_relation}
                          onChange={(e) =>
                            setContactInfo({
                              ...contactInfo,
                              emergency_contact_relation: e.target.value,
                            })
                          }
                          required
                          placeholder="Enter your relationship with the contact"
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label htmlFor="emergency-contact-number">
                          Contact Number
                        </label>
                        <input
                          type="tel"
                          id="emergency-contact-number"
                          value={contactInfo.emergency_contact_number}
                          onChange={(e) =>
                            setContactInfo({
                              ...contactInfo,
                              emergency_contact_number: e.target.value,
                            })
                          }
                          required
                          placeholder="Enter emergency contact number"
                        />
                      </div>
                    </div>
                    <div className={styles.formActions}>
                      <button type="submit" className={styles.primaryBtn}>
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* Academic Information Section */}
            <div
              className={`${styles.profileSection} ${
                activeSection === "academic-info" ? styles.active : ""
              }`}
              id="academic-info"
            >
              <h2>Academic Information</h2>
              {academicLoading ? (
                <Loading size="medium" />
              ) : academicError ? (
                <ErrorMessage message={academicError} />
              ) : (
                <div className="section-content">
                  <div className={styles.readonlyInfo}>
                    <div className={styles.infoGroup}>
                      <label>Student ID</label>
                      <p>{profile.student_id}</p>
                    </div>
                    <div className={styles.infoGroup}>
                      <label>Department</label>
                      <p>{profile.department}</p>
                    </div>
                    <div className={styles.infoGroup}>
                      <label>Year Level</label>
                      <p>{profile.year_level}</p>
                    </div>
                    <div className={styles.infoGroup}>
                      <label>Section</label>
                      <p>{profile.section}</p>
                    </div>
                    <div className={styles.infoGroup}>
                      <label>Enrollment Status</label>
                      <p>
                        {profile.enrollment_status.charAt(0).toUpperCase() +
                          profile.enrollment_status.slice(1)}
                      </p>
                    </div>
                    <div className={styles.infoGroup}>
                      <label>Enrollment Date</label>
                      <p>
                        {profile.enrollment_date
                          ? new Date(
                              profile.enrollment_date
                            ).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                    <div className={styles.infoGroup}>
                      <label>Adviser</label>
                      <p>{profile.adviser || "Not assigned"}</p>
                    </div>
                  </div>
                  <div className={styles.academicHistory}>
                    <h3>Academic History</h3>
                    {academicRecords && academicRecords.length > 0 ? (
                      <table className={styles.historyTable}>
                        <thead>
                          <tr>
                            <th>Academic Year</th>
                            <th>Semester</th>
                            <th>Units</th>
                            <th>GPA</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {academicRecords.map((record) => (
                            <tr key={record.id}>
                              <td>{record.academic_year}</td>
                              <td>{record.semester}</td>
                              <td>{record.units}</td>
                              <td>{record.gpa || "-"}</td>
                              <td>
                                {record.status.charAt(0).toUpperCase() +
                                  record.status.slice(1)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p>No academic records found.</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Documents Section */}
            <div
              className={`${styles.profileSection} ${
                activeSection === "documents" ? styles.active : ""
              }`}
              id="documents"
            >
              <h2>Documents</h2>
              {documentsLoading ? (
                <Loading size="medium" />
              ) : documentsError ? (
                <ErrorMessage message={documentsError} />
              ) : (
                <div className="section-content">
                  {documents && documents.length > 0 ? (
                    <ul className={styles.documentList}>
                      {documents.map((document) => (
                        <li key={document.id} className={styles.documentItem}>
                          <div className={styles.name}>{document.name}</div>
                          <div
                            className={
                              styles.status + " " + styles[document.status]
                            }
                          >
                            {document.status.charAt(0).toUpperCase() +
                              document.status.slice(1)}
                          </div>
                          <div className={styles.documentActions}>
                            {document.file_path && (
                              <button
                                className={`${styles.documentBtn} ${styles.downloadBtn}`}
                              >
                                Download
                              </button>
                            )}
                            {document.status !== "verified" && (
                              <>
                                <input
                                  type="file"
                                  id={`upload-${document.id}`}
                                  style={{ display: "none" }}
                                />
                                <button
                                  className={`${styles.documentBtn} ${styles.uploadBtn}`}
                                  onClick={() =>
                                    window.document
                                      .getElementById(`upload-${document.id}`)
                                      ?.click()
                                  }
                                >
                                  Upload
                                </button>
                              </>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No required documents found.</p>
                  )}
                </div>
              )}
            </div>

            {/* Account Settings Section */}
            <div
              className={`${styles.profileSection} ${
                activeSection === "account-settings" ? styles.active : ""
              }`}
              id="account-settings"
            >
              <h2>Account Settings</h2>
              <div className="section-content">
                <div className={styles.settingsSection}>
                  <h3>Password and Security</h3>
                  <div className={styles.settingsRow}>
                    <div className={styles.label}>Password</div>
                    <div className={styles.value}>********</div>
                    <button className={styles.primaryBtn}>
                      Change Password
                    </button>
                  </div>
                  <div className={styles.settingsRow}>
                    <div className={styles.label}>
                      Two-Factor Authentication
                    </div>
                    <div className={styles.value}>Not Enabled</div>
                    <button className={styles.primaryBtn}>Enable</button>
                  </div>
                </div>
                <div className={styles.settingsSection}>
                  <h3>Notifications</h3>
                  <div className={styles.settingsRow}>
                    <div className={styles.label}>Email Notifications</div>
                    <label className={styles.toggleSwitch}>
                      <input type="checkbox" defaultChecked />
                      <span className={styles.toggleSlider}></span>
                    </label>
                  </div>
                  <div className={styles.settingsRow}>
                    <div className={styles.label}>SMS Notifications</div>
                    <label className={styles.toggleSwitch}>
                      <input type="checkbox" />
                      <span className={styles.toggleSlider}></span>
                    </label>
                  </div>
                  <div className={styles.settingsRow}>
                    <div className={styles.label}>Due Date Reminders</div>
                    <label className={styles.toggleSwitch}>
                      <input type="checkbox" defaultChecked />
                      <span className={styles.toggleSlider}></span>
                    </label>
                  </div>
                </div>
                <div className={styles.settingsSection}>
                  <h3>Session</h3>
                  <div className={styles.settingsRow}>
                    <div className={styles.label}>Current Device</div>
                    <div className={styles.value}>
                      Windows PC - May 15, 2025
                    </div>
                    <button className={styles.primaryBtn}>Sign Out</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
