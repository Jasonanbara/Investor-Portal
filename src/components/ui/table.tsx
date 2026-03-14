import React from 'react';

/* ------------------------------------------------------------------ */
/*  Table                                                              */
/* ------------------------------------------------------------------ */

interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {}

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className = '', ...props }, ref) => (
    <div className="w-full overflow-auto">
      <table
        ref={ref}
        className={['w-full caption-bottom text-sm', className].join(' ')}
        {...props}
      />
    </div>
  )
);
Table.displayName = 'Table';

/* ------------------------------------------------------------------ */
/*  TableHeader                                                        */
/* ------------------------------------------------------------------ */

interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

const TableHeader = React.forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ className = '', ...props }, ref) => (
    <thead
      ref={ref}
      className={['border-b border-[#3a3c4e]', className].join(' ')}
      {...props}
    />
  )
);
TableHeader.displayName = 'TableHeader';

/* ------------------------------------------------------------------ */
/*  TableBody                                                          */
/* ------------------------------------------------------------------ */

interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className = '', ...props }, ref) => (
    <tbody
      ref={ref}
      className={['[&_tr:last-child]:border-0', className].join(' ')}
      {...props}
    />
  )
);
TableBody.displayName = 'TableBody';

/* ------------------------------------------------------------------ */
/*  TableRow                                                           */
/* ------------------------------------------------------------------ */

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {}

const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className = '', ...props }, ref) => (
    <tr
      ref={ref}
      className={[
        'border-b border-[#3a3c4e] transition-colors',
        'hover:bg-[#3a3c4e]/30',
        'even:bg-[#282A35]/50',
        className,
      ].join(' ')}
      {...props}
    />
  )
);
TableRow.displayName = 'TableRow';

/* ------------------------------------------------------------------ */
/*  TableHead (th)                                                     */
/* ------------------------------------------------------------------ */

interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  sortable?: boolean;
  sorted?: 'asc' | 'desc' | false;
  onSort?: () => void;
}

const SortIcon: React.FC<{ direction?: 'asc' | 'desc' | false }> = ({ direction }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0"
  >
    <path
      d="M7 2.5L10 6H4L7 2.5Z"
      fill={direction === 'asc' ? '#C6AB4E' : '#8b8fa3'}
      opacity={direction === 'asc' ? 1 : 0.4}
    />
    <path
      d="M7 11.5L4 8H10L7 11.5Z"
      fill={direction === 'desc' ? '#C6AB4E' : '#8b8fa3'}
      opacity={direction === 'desc' ? 1 : 0.4}
    />
  </svg>
);

const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ sortable = false, sorted = false, onSort, className = '', children, ...props }, ref) => (
    <th
      ref={ref}
      onClick={sortable ? onSort : undefined}
      className={[
        'h-10 px-4 text-left align-middle text-xs font-semibold uppercase tracking-wider text-[#8b8fa3]',
        sortable ? 'cursor-pointer select-none hover:text-[#CFD2E5]' : '',
        className,
      ].join(' ')}
      {...props}
    >
      <span className="inline-flex items-center gap-1">
        {children}
        {sortable && <SortIcon direction={sorted || undefined} />}
      </span>
    </th>
  )
);
TableHead.displayName = 'TableHead';

/* ------------------------------------------------------------------ */
/*  TableCell (td)                                                     */
/* ------------------------------------------------------------------ */

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {}

const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className = '', ...props }, ref) => (
    <td
      ref={ref}
      className={['px-4 py-3 align-middle text-[#CFD2E5]', className].join(' ')}
      {...props}
    />
  )
);
TableCell.displayName = 'TableCell';

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell };
export type {
  TableProps,
  TableHeaderProps,
  TableBodyProps,
  TableRowProps,
  TableHeadProps,
  TableCellProps,
};
