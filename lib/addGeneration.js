export async function addGeneration(prediction) {
  const body = { name: "test", prediction: prediction };
  const response = await fetch("/api/usertest", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}
