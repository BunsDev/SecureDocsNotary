const SearchBar = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
}) => {
  return (
    <div className="flex items-center mb-4">
      <input
        type="text"
        placeholder="Search by file name or email"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-1/3 p-2 mr-4 border border-gray-300 rounded"
      />
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="p-2 border border-gray-300 rounded"
      >
        <option value="">filters</option>
        <option value="verified">Notary</option>
      </select>
    </div>
  );
};

export default SearchBar;
