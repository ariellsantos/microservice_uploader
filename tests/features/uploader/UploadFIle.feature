Feature: Upload File
  As a client I want to upload a file to a storage
  Scenario: Upload a file to storage successfully
    Given I send a POST request to "/uploads" with body:
    """
    {
      "data": "C0ktLlFIy8xJVShJrSgBAA==",
      "fileName": "folder/to/file/test.txt"
    }
    """

    Then the response status code should be 201