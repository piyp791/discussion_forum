import uuid, requests, json, sys

task = sys.argv[1];
#print task

response = requests.post("https://beta.todoist.com/API/v8/tasks",
    params={"token": "9c73b0494607632b5980b42f46c7df0efcfc4cee"},
    data=json.dumps({"content": task,
                     "project_id": 2163600601,
                     "due_lang": "en"}),
    headers={
        "Content-Type": "application/json",
        "X-Request-Id": str(uuid.uuid4()),
    }
).json()

print (response)
sys.stdout.flush()
