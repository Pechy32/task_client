/**
 * InputSelect Component
 * 
 * A reusable select input component that supports both single and multiple selections.
 * It handles different types of item structures (simple values or objects) and can display
 * a prompt for empty selections.
 * 
 * Props:
 * - label (string): The label text for the select input.
 * - name (string): The name attribute for the select input.
 * - value (string|array): The currently selected value(s). Can be a string or an array of strings.
 * - items (array): The list of items to display in the select dropdown.
 *    - If `enum` is provided, `items` should be an array of strings corresponding to the keys of `enum`.
 *    - Otherwise, `items` should be an array of objects with at least an `_id` and `name` property.
 * - multiple (boolean): Whether the select allows multiple selections.
 * - required (boolean): Whether the select input is required. Defaults to false.
 * - prompt (string): The prompt text to display when no selection is made.
 * - enum (object): An optional mapping of item keys to display names, used when `items` is an array of strings.
 * - handleChange (function): The function to call when the selected value changes.
 * 
 * @param {object} props - The props object for the InputSelect component.
 * @returns {JSX.Element} The rendered select input component.
 */
export function InputSelect({
  label,
  name,
  value,
  items,
  multiple = false,
  required = false,
  prompt,
  enum: enumMapping,
  handleChange,
}) {
  // Determine if the current selection is empty
  const emptySelected = multiple ? (value?.length === 0) : !value;

  // Determine if items are objects (e.g., from a database) or simple values (e.g., from an enum)
  const objectItems = !enumMapping;

  return (
    <div className="form-group">
      <label>{label}:</label>
      <select
        required={required}
        className="browser-default form-select"
        multiple={multiple}
        name={name}
        onChange={handleChange}
        value={value}
      >
        {/* Render the prompt option */}
        {required ? (
          <option disabled value="">
            {prompt}
          </option>
        ) : (
          <option key="0" value="">
            ({prompt})
          </option>
        )}

        {/* Render the select options */}
        {objectItems
          ? items.map((item, index) => (
            <option key={item._id} value={item._id}>
              {item.name}
            </option>
          ))
          : items.map((item, index) => (
            <option key={item} value={item}>
              {enumMapping[item]}
            </option>
          ))}
      </select>
    </div>
  );
}

export default InputSelect;