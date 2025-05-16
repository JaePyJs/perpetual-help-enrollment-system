import React from "react";

/**
 * Pagination Component
 * 
 * A versatile pagination component that follows the design system.
 * Supports different sizes and variants.
 */
type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  size?: "small" | "medium" | "large";
  variant?: "default" | "rounded" | "simple";
  className?: string;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  disabled?: boolean;
};

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  size = "medium",
  variant = "default",
  className = "",
  showFirstLast = true,
  showPrevNext = true,
  disabled = false,
}: PaginationProps) {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers: (number | string)[] = [];
    
    // Calculate range of pages to show
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);
    
    // Determine if we need to show ellipsis
    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 1;
    
    // Always show first page
    if (leftSiblingIndex > 1) {
      pageNumbers.push(1);
    }
    
    // Show left ellipsis if needed
    if (shouldShowLeftDots) {
      pageNumbers.push("...");
    }
    
    // Add page numbers between ellipses
    for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
      pageNumbers.push(i);
    }
    
    // Show right ellipsis if needed
    if (shouldShowRightDots) {
      pageNumbers.push("...");
    }
    
    // Always show last page
    if (rightSiblingIndex < totalPages) {
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };
  
  // Handle page change
  const handlePageChange = (page: number) => {
    if (page !== currentPage && page >= 1 && page <= totalPages && !disabled) {
      onPageChange(page);
    }
  };
  
  // Combine class names based on props
  const paginationClasses = [
    "pagination",
    `pagination-${size}`,
    `pagination-${variant}`,
    disabled ? "pagination-disabled" : "",
    className,
  ].filter(Boolean).join(" ");
  
  // For simple variant, only show prev/next
  if (variant === "simple") {
    return (
      <div className={paginationClasses} role="navigation" aria-label="Pagination">
        <button
          type="button"
          className="pagination-prev"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1 || disabled}
          aria-label="Previous page"
        >
          Previous
        </button>
        <span className="pagination-info">
          Page {currentPage} of {totalPages}
        </span>
        <button
          type="button"
          className="pagination-next"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || disabled}
          aria-label="Next page"
        >
          Next
        </button>
      </div>
    );
  }
  
  // For default and rounded variants
  return (
    <div className={paginationClasses} role="navigation" aria-label="Pagination">
      {showFirstLast && (
        <button
          type="button"
          className="pagination-first"
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1 || disabled}
          aria-label="First page"
        >
          First
        </button>
      )}
      
      {showPrevNext && (
        <button
          type="button"
          className="pagination-prev"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1 || disabled}
          aria-label="Previous page"
        >
          Prev
        </button>
      )}
      
      <div className="pagination-pages">
        {getPageNumbers().map((page, index) => {
          if (typeof page === "string") {
            return (
              <span key={`ellipsis-${index}`} className="pagination-ellipsis">
                {page}
              </span>
            );
          }
          
          const isActive = page === currentPage;
          const pageClasses = [
            "pagination-page",
            isActive ? "pagination-page-active" : "",
          ].filter(Boolean).join(" ");
          
          return (
            <button
              key={page}
              type="button"
              className={pageClasses}
              onClick={() => handlePageChange(page)}
              disabled={disabled}
              aria-label={`Page ${page}`}
              aria-current={isActive ? "page" : undefined}
            >
              {page}
            </button>
          );
        })}
      </div>
      
      {showPrevNext && (
        <button
          type="button"
          className="pagination-next"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || disabled}
          aria-label="Next page"
        >
          Next
        </button>
      )}
      
      {showFirstLast && (
        <button
          type="button"
          className="pagination-last"
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages || disabled}
          aria-label="Last page"
        >
          Last
        </button>
      )}
    </div>
  );
}
