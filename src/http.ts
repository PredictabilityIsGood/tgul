export const unwrapResponse = async (response: any) => {
    return response.ok ? await response.json() : { status: false, data:"request failed"};
};

export const handleRequest = async (callback: Function) => {
    try {
        const response = await callback()
        const result = await unwrapResponse(response);
        return (result.status ? result.data : result.status) as any;
    } catch (err) {
        console.error('Error:', err);
        return false;
    }
};