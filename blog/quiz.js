/* Sjovt Dansk blog — quick-check quizzes. Vanilla JS, works on file://.
   Markup: <div class="quiz" data-answer="N"> ... <div class="opts"><button>..</button>...</div>
           <p class="why" hidden>..</p> <details class="nojs">..</details> </div>
   data-answer is the 0-based index of the right button. Without JS the <details> shows the answer. */
(function () {
  "use strict";
  document.documentElement.classList.add("blog-js");

  function setup(quiz) {
    var buttons = quiz.querySelectorAll(".opts button");
    var answer = parseInt(quiz.getAttribute("data-answer"), 10);
    var why = quiz.querySelector(".why");
    var live = document.createElement("p");
    live.className = "sd-sr"; live.setAttribute("aria-live", "polite");
    quiz.appendChild(live);

    Array.prototype.forEach.call(buttons, function (btn, i) {
      btn.type = "button";
      btn.addEventListener("click", function () {
        var right = i === answer;
        Array.prototype.forEach.call(buttons, function (b, j) {
          b.disabled = true;
          if (j === answer) b.classList.add("is-right");
        });
        if (!right) btn.classList.add("is-wrong");
        if (why) why.hidden = false;
        live.textContent = (right ? "Correct. " : "Not quite. The answer is " + buttons[answer].textContent + ". ") +
          (why ? why.textContent : "");
      });
    });
  }

  Array.prototype.forEach.call(document.querySelectorAll(".quiz"), setup);
})();
