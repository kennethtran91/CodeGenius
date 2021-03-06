module Api
  class NotesController < ApplicationController
    def update
      @note = Note.find(params[:id])

      if @note.update(note_params.merge({author: current_user}))
        render json: @note
      else
        render json: @note.errors.full_messages, status: :unprocessable_entity
      end
    end

    def create
      @note = current_user.notes.new(note_params)

      if @note.save
        render json: @note
      else
        render json: @note.errors.full_messages, status: :unprocessable_entity
      end
    end

    def show
      @note = Note.find(params[:id])
      render :show
    end

    def destroy
      @note = Note.find(params[:id])
      authorize! :destroy, @note
      @note.destroy!
      render json: @note
    end

    def revert
      @note = Note.find(params[:note_id])
      authorize! :destroy, @note
      @revision = NoteRevision.find(params[:revision_id])
      @note.revert(@revision)
      @note = Note.find(params[:note_id])
      render :show
    end

    private
    def note_params
      params.require(:note).permit(:body, :phile_id, :start, :finish)
    end
  end
end
