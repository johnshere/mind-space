/**
 * 'a-simple-test-1' => 'A Simple Test 1'
 * 'a_simple_test_2' => 'A Simple Test 2'
 * 'a simple-test_3' => 'A Simple Test 3'
 * 'a simple test 4' => 'A Simple Test 4'
 * @param str
 * @returns
 */
export const titleCase = (str: string) => {
  return str
    .replace(/[_-]/g, ' ')
    .split(' ')
    .filter((word) => word)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}
