Feature: Generate URI for file uploaded
  As a client a want to get a uri to download the file

  Scenario: Download a file uploaded
    Given I send a POST request to "/uploads" with body:
    """
    {
      "data": "C0ktLlFIy8xJVShJrSgBAA==",
      "fileName": "folder/to/file/test.txt"
    }
    """
    And the response status code should be 201
    Given I send a GET request to "/uploads/uri/folder%2Fto%2Ffile%2Ftest.txt"
    And the response status code should be 200
    Then It should return a valid URI
    And I should be able to download the file and the file should be equals to "folder/to/file/test.txt"

  Scenario: Throw an error cause file doesn't exists
    Given I send a GET request to "/uploads/uri/folder%2Fto%2Ffile%2Ftest1.txt"
    Then the response status code should be 404

