function SearchBar({ search, setSearch }) {
  return (
    <input
      type="text"
      placeholder="Search your favourite recipes..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  );
}

export default SearchBar;