# migration_cleanup_list.md

## Unnecessary Files/Folders in memory_bank/

The following files are not required for the core Memory Bank workflow and can be deleted to keep the documentation clean and focused:

- `frontend_migration.md` (superseded by `frontend_migration_updated.md`)
- `frontend_migration_updated.md` (content now tracked in nextjs_migration_update.md and progress.md)
- `reflect-template.md` (template, not used in current workflow)
- `creative-template.md` (template, not used in current workflow)
- `decisionLog.md` (empty, not used)
- `tasks.md` (task tracking is now in migration_tasks.md and progress.md)
- `nextjs_migration_summary.md` (redundant with nextjs_migration_update.md)
- `supabase_integration.md` (integration details are now in techContext.md and systemPatterns.md)
- Any other files not referenced in the Memory Bank structure (projectbrief.md, productContext.md, systemPatterns.md, techContext.md, activeContext.md, progress.md, migration_tasks.md, migration_cleanup_list.md, student_profile_migration.md, nextjs_migration_update.md are core or relevant context)

## To Delete (May 2025)

- All legacy HTML files in enrollment-frontend/ that are not referenced by the Next.js app in enrollment-nextjs/ (e.g., user-registration.html, student-enrollment.html, etc.)
- All legacy CSS and JS files in enrollment-frontend/ that are not referenced by the Next.js app
- Outdated or duplicate design guideline markdowns (e.g., ui-design-guidelines.md, ui-design-guidelines-expanded.md) if not referenced in documentation or code
- Unused files in reference/ directory (admin-dashboard.html, loginpage.html, etc.)
- Any other files in enrollment-frontend/ or reference/ that are not required for the Next.js migration or current documentation

## To keep

- `projectbrief.md`
- `productContext.md`
- `systemPatterns.md`
- `techContext.md`
- `activeContext.md`
- `progress.md`
- `migration_tasks.md`
- `migration_cleanup_list.md`
- `student_profile_migration.md`
- `nextjs_migration_update.md`
