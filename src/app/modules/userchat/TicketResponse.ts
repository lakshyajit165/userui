export interface TicketResponse{
    result: {
        id: string,
        uuid: string,
        query: string,
        intent: string[],
        raisedBy: string,
        createdOn: string,
        assignedTime: string,
        updatedTime: string,
        assignedTo: string,
        rating: number,
        entity: string,
        type: string,
        status: string,
        responseType: string,
        resolvedBy: string,
        reopenTime: string
    },
    message: string,
    errors: string
}